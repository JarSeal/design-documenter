const User = require('../../models/user');
const shared = require('../../shared');

const validateField = (form, key, value) => {
    if(key === 'id') return null;
    
    const fieldsets = form.fieldsets;
    for(let i=0; i<fieldsets.length; i++) {
        const fieldset = fieldsets[i];
        for(let j=0; j<fieldset.fields.length; j++) {
            const field = fieldset.fields[j];
            if(field.id === key) {
                switch(field.type) {
                case 'textinput':
                    return textInput(field, value.trim());
                case 'checkbox':
                    return checkbox(field, value);
                case 'dropdown':
                    return dropdown(field, value);
                case 'textarea':
                    return textArea(field, value.trim());
                default:
                    return checkAllowedFieldTypes(field.type);
                }
            }
        }
    }
};

const textInput = (field, value) => {
    if(field.required && (!value || value === '')) return 'Required';
    if(field.minLength && value.length < field.minLength && value !== '') return `Value is too short (minimum: ${field.minLength} chars)`;
    if(field.maxLength && value.length > field.maxLength) return `Value is too long (maximum: ${field.maxLength} chars)`;
    if(field.email && value.length && !shared.parsers.validateEmail(value)) return 'Email not valid';
    if(value.length && field.regex) {
        const regex = new RegExp(field.regex);
        if(!regex.test(value)) return 'Wrong format';
    }
    return null;
};

const checkbox = (field, value) => {
    if(field.required && (!value || value === false)) return 'Required';
    return null;
};

const dropdown = (field, value) => {
    if(field.required && String(value).trim() === '') return 'Required';
    // Validate that the value passed is one of the options
    let valueFound = false;
    for(let i=0; i<field.options.length; i++) {
        if(String(field.options[i].value).trim() === String(value).trim()) {
            valueFound = true;
            break;
        }
    }
    if(!valueFound) return 'Unknown value';
    return null;
};

const textArea = (field, value) => {
    if(field.required && (!value || value === '')) return 'Required';
    if(field.minLength && value.length < field.minLength && value !== '') return `Value is too short (minimum: ${field.minLength} chars)`;
    if(field.maxLength && value.length > field.maxLength) return `Value is too long (maximum: ${field.maxLength} chars)`;
    if(value.length && field.regex) {
        const regex = new RegExp(field.regex);
        if(!regex.test(value)) return 'Wrong format';
    }
    return null;
};

const checkAllowedFieldTypes = (type) => {
    if(type === 'divider' || type === 'subheading') {
        return null;
    }
    return 'Field type not found.';
};

const validateKeys = (form, keys) => {
    if(keys.length < 2) return false;
    const submitFields = form.submitFields;
    let keysFound = 0;
    for(let i=0; i<submitFields.length; i++) {
        for(let j=0; j<keys.length; j++) {
            if(submitFields[i] === keys[j]) {
                keysFound++;
                break;
            }
        }
    }
    return keysFound === submitFields.length;
};

const validateFormData = async (formData, request) => {
    const body = request.body;
    console.log(request.token, request.decodedToken);
    if(!formData || !formData.form) {
        return {
            code: 404,
            obj: { msg: 'Could not find form (' + body.id + '),' },
        };
    }
    const form = formData.form;

    const error = await validatePrivileges(form, request);
    if(error) {
        return error;
    }

    const keys = Object.keys(body);
    const keysFound = validateKeys(formData.form, keys);
    if(!keysFound) {
        return {
            code: 400,
            obj: { msg: 'Bad request. Payload missing or incomplete.' },
        };
    }

    const errors = {};
    for(let i=0; i<keys.length; i++) {
        // Payload contains extra/undefined keys or no keys at all
        let error = validateField(formData.form, keys[i], body[keys[i]]);
        if(error) errors[keys[i]] = error;
    }
    const errorKeys = Object.keys(errors);
    if(errorKeys.length) {
        return {
            code: 400,
            obj: { msg: 'Bad request. Validation errors.', errors },
        };
    }

    return null;
};

const validatePrivileges = async (form, request) => {
    if(form.server && form.server.userLevel) {
        if(!request.token || (request.decodedToken && !request.decodedToken.id)) {
            return {
                code: 401,
                obj: { msg: 'Token missing or invalid.' },
            };
        } else {
            const user = await User.findById(request.decodedToken.id);
            const requiredLevel = form.server.userLevel;
            if(requiredLevel > user.userLevel) {
                return {
                    code: 401,
                    obj: { msg: 'User not authorised.' },
                };
            }
        }
    }
};

const removeServerData = (form) => {
    if(form.server) {
        delete form.server;
    }
    return form;
};

module.exports = { validateField, validateKeys, validateFormData, removeServerData };