const csrf = require('csurf');
const User = require('../../models/user');
const shared = require('../../shared');
const logger = require('./../../utils/logger');

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
    if(type === 'divider' || type === 'subheading' || type === 'subdescription') {
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

const validateFormData = async (formData, request, user) => {
    const body = request.body;
    if(!formData || !formData.form) {
        return {
            code: 404,
            obj: { msg: 'Could not find form (' + body.id + '),' },
        };
    }

    const error = await validatePrivileges(formData, request, user);
    if(error) return error;

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

const validatePrivileges = async (form, request, user) => {
    if(form.useRightsLevel && form.useRightsLevel !== 0) {
        const sess = request.session;
        if(!sess || !sess.username) {
            logger.log(`User not authenticated or session has expired. Trying to access form with id ${form.formId}. (+ token)`, request.token);
            return {
                code: 401,
                obj: {
                    msg: 'User not authenticated or session has expired.',
                    _sess: false,
                },
            };
        } else {
            if(!user) {
                user = await User.findById(sess._id);
            }
            const requiredLevel = form.useRightsLevel;
            if(requiredLevel > user.userLevel) {
                logger.error(`User not authorised. Trying to access form with id ${form.formId}.`);
                return {
                    code: 401,
                    obj: {
                        unauthorised: true,
                        msg: 'User not authorised.'
                    },
                };
            }

            // Check here for possible groups and user list
        }
    }
};

const csrfProtection = csrf({ cookie: false });

module.exports = {
    validateField,
    validateKeys,
    validateFormData,
    validatePrivileges,
    csrfProtection,
};