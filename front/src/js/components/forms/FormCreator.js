import { getLang, getText } from "../../helpers/lang";
import { Component, Logger, State } from "../../LIGHTER";
import Checkbox from "./formComponents/Checkbox";
import Dropdown from "./formComponents/Dropdown";
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";

// Attributes for data (id will not be used, it comes from form data):
// - afterFormSentFn = function to call after succesfull form submission [Function]
class FormCreator extends Component {
    constructor(data) {
        super(data);
        this.logger = new Logger('Form Creator *****');
        this._validateImportedFormData(data);
        this.template = `<form></form>`;
        this.components = {};
        this.componentsOrder = [];
        this.curLang = getLang();
        this.formSentOnce = false;
        this.fieldErrors = new State();
        this.formErrorClassSetterTimer;

        this._createFormComponents(data);
    }

    addListeners = () => {
        this.addListener({
            type: 'submit',
            fn: this.handleSubmit,
        });
    }

    paint = (data) => {
        for(let i=0; i<this.componentsOrder.length; i++) {
            const key = this.componentsOrder[i];
            this.components[key].draw();
        }
    }

    _createFormComponents(data) {
        let id, text;
        
        // Form title and description
        text = this._getTextData(data.formTitle, data.formTitleId);
        if(text) {
            id = this.id+'-title';
            this.componentsOrder.push(id);
            this.components[id] = this.addChild(new Component({
                id, tag: 'h3', text, class: 'form-main-title'
            }));
        }
        text = this._getTextData(data.formDesc, data.formDescId);
        if(text) {
            id = this.id+'-description';
            this.componentsOrder.push(id);
            this.components[id] = this.addChild(new Component({
                id, tag: 'p', text, class: 'form-main-description'
            }));
        }

        // Fieldsets
        for(let i=0; i<data.fieldsets.length; i++) {
            const fieldset = data.fieldsets[i];
            const fieldsetId = fieldset.id;

            fieldset.tag = 'fieldset';
            this.componentsOrder.push(fieldsetId);
            this.components[fieldsetId] = this.addChild(new Component(fieldset));

            // Fieldset title and description
            text = this._getTextData(fieldset.fieldsetTitle, fieldset.fieldsetTitleId);
            if(text) {
                id = this.id+'-fieldset-'+i+'-title';
                this.componentsOrder.push(id);
                this.components[id] = this.addChild(new Component({
                    id, tag: 'h3', text, class: 'fieldset-title', attach: fieldsetId
                }));
            }
            text = this._getTextData(fieldset.fieldsetDesc, fieldset.fieldsetDescId);
            if(text) {
                id = this.id+'-fieldset-'+i+'-description';
                this.componentsOrder.push(id);
                this.components[id] = this.addChild(new Component({
                    id, tag: 'p', text, class: 'fieldset-description', attach: fieldsetId
                }));
            }

            // Fields
            for(let j=0; j<fieldset.fields.length; j++) {
                const field = fieldset.fields[j];
                const fieldIdPrefix = this.id+'-'+i+'-'+j;

                // Divider
                if(field.type === 'divider') {
                    id = fieldIdPrefix+'-divider';
                    this.componentsOrder.push(id);
                    this.components[id] = this.addChild(new Component({
                        id, class: 'form-divider', attach: fieldsetId
                    }));
                }

                // Subheading
                else if(field.type === 'subheading') {
                    id = fieldIdPrefix+'-subheading';
                    text = this._getTextData(field.content, field.contentId);
                    this.componentsOrder.push(id);
                    this.components[id] = this.addChild(new Component({
                        id, tag: 'h4', class: 'form-subheading', attach: fieldsetId, text
                    }));
                }

                // Text input
                else if(field.type === 'textinput') {
                    this._fieldTextInput(field, fieldsetId, fieldIdPrefix);
                }

                // Checkbox
                else if(field.type === 'checkbox') {
                    this._fieldCheckbox(field, fieldsetId, fieldIdPrefix);
                }

                // Dropdown
                else if(field.type === 'dropdown') {
                    this._fieldDropdown(field, fieldsetId, fieldIdPrefix);
                }
            }
        }

        // Spinner

        // Submit button
        const button = data.submitButton;
        id = button.id || this.id+'-submit-button';
        text = this._getTextData(button.label, button.labelId);
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new SubmitButton({
            id, text, class: button.class
        }));
    }

    _fieldDropdown(field, fieldsetId, fieldIdPrefix) {
        let id = field.id;
        if(!id) id = fieldIdPrefix+'-dropdown';
        const label = (field.required ? '* ' : '') + this._getTextData(field.label, field.labelId);
        this.fieldErrors.set(id, false);
        const options = [];
        for(let i=0; i<field.options.length; i++) {
            options.push(field.options[i]);
            options[i].label = this._getTextData(field.options[i].label, field.options[i].labelId);
        }
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new Dropdown({
            id,
            name: field.name,
            class: field.class,
            label,
            attach: fieldsetId,
            disabled: field.disabled,
            value: field.initValue,
            options,
            emptyIsAnOption: field.emptyIsAnOption,
            field,
            changeFn: (e) => {
                const val = e.target.value;
                this._fieldDropdownErrorCheck(val, id, field, fieldsetId);
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val, id, fieldsetId, errorStates: this.fieldErrors, field: this.components[id], components: this.components
                    });
                }
                if(this.formSentOnce) this.components[id].error(this.fieldErrors.get(id));
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldDropdownErrorCheck;
    }

    _fieldCheckbox(field, fieldsetId, fieldIdPrefix) {
        let id = field.id;
        if(!id) id = fieldIdPrefix+'-checkbox';
        const label = (field.required ? '* ' : '') + this._getTextData(field.label, field.labelId);
        this.fieldErrors.set(id, false);
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new Checkbox({
            id,
            name: field.name,
            class: field.class,
            label,
            attach: fieldsetId,
            disabled: field.disabled,
            checked: field.initValue ? true : false,
            field,
            changeFn: (e) => {
                const val = e.target.checked;
                this._fieldCheckboxErrorCheck(val, id, field, fieldsetId);
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val, id, fieldsetId, errorStates: this.fieldErrors, field: this.components[id], components: this.components
                    });
                }
                if(this.formSentOnce) this.components[id].error(this.fieldErrors.get(id));
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldCheckboxErrorCheck;
    }

    _fieldTextInput(field, fieldsetId, fieldIdPrefix) {
        let id = field.id;
        if(!id) id = fieldIdPrefix+'-textinput';
        const label = (field.required ? '* ' : '') + this._getTextData(field.label, field.labelId);
        const placeholder = this._getTextData(field.placeholder, field.placeholderId);
        this.fieldErrors.set(id, false);
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new TextInput({
            id,
            name: field.name,
            class: field.class,
            label,
            placeholder,
            attach: fieldsetId,
            disabled: field.disabled,
            maxlength: field.maxLength,
            value: field.maxLength
                ? (field.initValue.substring(0, parseInt(field.maxLength)) || '')
                : field.initValue || '',
            password: field.password,
            field,
            changeFn: (e) => {
                const val = e.target.value;
                this._fieldTextInputErrorCheck(val, id, field, fieldsetId);
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val, id, fieldsetId, errorStates: this.fieldErrors, field: this.components[id], components: this.components
                    });
                }
                if(this.formSentOnce) this.components[id].error(this.fieldErrors.get(id));
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldTextInputErrorCheck;
    }

    _fieldDropdownErrorCheck = (val, id, field, fieldsetId) => {
        console.log('HERE', val === '' ? '[EMPTY]' : val);
        if(field.required && val === '') {
            this.fieldErrors.set(id, {
                errorMsg: getText('required'),
                fieldsetId,
                id
            });
        } else {
            this.fieldErrors.set(id, false);
        }
        if(field.validationFn) {
            field.validationFn({
                val, id, fieldsetId, errorStates: this.fieldErrors, field, components: this.components, fieldsetErrorCheck: this.fieldsetErrorCheck
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    _fieldCheckboxErrorCheck = (val, id, field, fieldsetId) => {
        if(field.required && val === false) {
            this.fieldErrors.set(id, {
                errorMsg: getText('required'),
                fieldsetId,
                id
            });
        } else {
            this.fieldErrors.set(id, false);
        }
        if(field.validationFn) {
            field.validationFn({
                val, id, fieldsetId, errorStates: this.fieldErrors, field, components: this.components, fieldsetErrorCheck: this.fieldsetErrorCheck
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    _fieldTextInputErrorCheck = (val, id, field, fieldsetId) => {
        val = val.trim();
        if(field.required && !val.length) {
            this.fieldErrors.set(id, {
                errorMsg: getText('required'),
                fieldsetId,
                id
            });
            if(field.required !== true) { // field.required is a function then
                field.required({ val, id, fieldsetId });
            }
        } else if(val.length && val.length < field.minLength) {
            this.fieldErrors.set(id, {
                errorMsg: getText('minimum_x_characters', [field.minLength]),
                fieldsetId,
                id
            });
        } else {
            this.fieldErrors.set(id, false);
        }
        if(field.validationFn) {
            field.validationFn({
                val, id, fieldsetId, errorStates: this.fieldErrors, field, components: this.components, fieldsetErrorCheck: this.fieldsetErrorCheck
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    fieldsetErrorCheck = (fieldsetId) => {
        clearTimeout(this.formErrorClassSetterTimer);
        this.formErrorClassSetterTimer = setTimeout(() => {
            const formErrorCssClass = 'form--errors';
            const fieldsetErrorCssClass = 'fieldset--errors';
            const keys = this.fieldErrors.getKeys();
            const fieldsets = this.data.fieldsets;
            for(let i=0; i<fieldsets.length; i++) {
                // Clean all errors
                const elem = document.getElementById(fieldsets[i].id);
                elem.classList.remove(fieldsetErrorCssClass);
            }
            this.elem.classList.remove(formErrorCssClass); // Clean form error class
            
            let formErrors = false;
            for(let i=0; i<keys.length; i++) {
                const err = this.fieldErrors.get(keys[i]);
                if(err.fieldsetId === fieldsetId) {
                    // Set new field errors
                    const elem = document.getElementById(fieldsetId);
                    elem.classList.add(fieldsetErrorCssClass);
                    formErrors = true;
                }
            }
            
            if(formErrors) this.elem.classList.add(formErrorCssClass); // Set form error class
        }, 500);
    }

    _getTextData(stringOrObject, langId) {
        if(stringOrObject || langId) {
            let text;
            if(stringOrObject) {
                if(typeof stringOrObject === 'string' || stringOrObject instanceof String) {
                    text = stringOrObject;
                } else {
                    text = stringOrObject[this.curLang];
                }
            } else {
                text = getText(langId);
            }
            return text;
        }
        return null;
    }

    _validateImportedFormData(data) {
        if(!data.fieldsets || data.fieldsets.length === 0) {
            this.logger.error('Form data is missing a fieldset.');
            throw new Error('Call stack');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formSentOnce = true;

        // Check form errors
        let formHasErrors = false;
        for(let i=0; i<this.componentsOrder.length; i++) {
            const comp = this.components[this.componentsOrder[i]];
            if(comp.errorChecker) {
                comp.errorChecker(comp.value, comp.id, comp.data.field, comp.fieldsetId);
                comp.error(this.fieldErrors.get(comp.id));
                formHasErrors = true;
            }
        }
    }
}

export default FormCreator;