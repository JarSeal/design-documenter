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
    if(field.required && (!value || value.trim() === '')) return 'Required.';
    
    return null;
};

const checkbox = (field, value) => {
    if(field.required && (!value || value === false)) return 'Required.';
    return null;
};

const dropdown = (field, value) => {
    if(field.required && (!value || value.trim() === '')) return 'Required.';
    return null;
};

const checkAllowedFieldTypes = (type) => {
    if(type === 'divider' || type === 'subheading') {
        return null;
    }
    return 'Field type not found.';
};

const validateKeys = (form, keys) => {
    console.log('VALIDATA');
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
    console.log(keysFound, keys.length);
    return keysFound === keys.length;
};

module.exports = { validateField, validateKeys };