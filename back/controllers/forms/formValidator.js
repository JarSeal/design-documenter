const shared = require('./../../shared');

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
                    return textInput(field, value);
                case 'checkbox':
                    return checkbox(field, value);
                case 'dropdown':
                    return dropdown(field, value);
                default:
                    return checkAllowedFieldTypes(field.type);
                }
            }
        }
    }
};

const textInput = (field, value) => {
    if(field.required && (!value || value.trim() === '')) return 'Required';
    if(field.minLength && value.trim().length < field.minLength && value.trim() !== '') return `Value is too short (minimum: ${field.minLength} chars)`;
    if(field.maxLength && value.trim().length > field.maxLength) return `Value is too long (maximum: ${field.maxLength} chars)`;
    if(field.email && value.trim().length && !shared.parsers.validateEmail(value)) return 'Email not valid';
    return null;
};

const checkbox = (field, value) => {
    if(field.required && (!value || value === false)) return 'Required';
    return null;
};

const dropdown = (field, value) => {
    if(field.required && (!value || value.trim() === '')) return 'Required';
    return null;
};

const checkAllowedFieldTypes = (type) => {
    if(type === 'divider' || type === 'subheading') {
        return null;
    }
    return 'Field type not found.';
};

const validateKeys = (form, keys) => {
    if(keys < 2) return false;
    const fieldsets = form.fieldsets;
    let keysFound = 1; // Id is counted as one
    for(let i=0; i<fieldsets.length; i++) {
        const fieldset = fieldsets[i];
        for(let j=0; j<fieldset.fields.length; j++) {
            const field = fieldset.fields[j];
            for(let k=0; k<keys.length; k++) {
                if(keys[k] === field.id) keysFound++;
            }
        }
    }
    return keysFound === keys.length;
};

module.exports = { validateField, validateKeys };