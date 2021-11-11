import axios from 'axios';
import { getLang, getText } from "../../helpers/lang";
const shared = require('../../shared/index.js');
import { Component, Logger, State } from "../../LIGHTER";
import { _CONFIG } from "../../_CONFIG";
import validationFns from './formData/validationFns';
import Spinner from '../widgets/Spinner';
import Checkbox from "./formComponents/Checkbox";
import Dropdown from "./formComponents/Dropdown";
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";

// Attributes for data:
// - local = must be set to true if local forms are used (all the form data must then be in in the data) [Boolean]
// - afterFormSentFn = function to call after succesfull form submission [Function]
class FormCreator extends Component {
    constructor(data) {
        super(data);
        this.logger = new Logger('Form Creator *****');
        this.afterFormSentFn = data.afterFormSentFn;
        this.template = `<form class="form-creator"></form>`;
        this.components = {};
        this.componentsOrder = [];
        this.curLang = getLang();
        this.formSentOnce = false;
        this.formSubmitted = false;
        this.fieldErrors = new State();
        this.formState = new State({
            getting: false,
            sending: false,
        });
        this.formErrorClassSetterTimer;
        this.submitButtonId;
        this.fieldsetIds = [];
        this.cssClasses = {
            formSent: 'form--sent',
            formError: 'form--errors',
            fieldsetError: 'fieldset--errors',
            formSuccess: 'form--success',
        };

        if(data.local) {
            this._createFormComponents(data);
        } else {
            const spinnerFadeTime = 400;
            this.mainSpinner = this.addChild(new Spinner({
                id: this.id+'-main-spinner',
                fadeTime: spinnerFadeTime,
                class: 'form-loader-spinner',
            }));
            this.formState.addListener('getting', (newValue) => {
                if(newValue === false) {
                    this._createFormComponents(this.data);
                    this.rePaint();
                    this.mainSpinner.showSpinner(false);
                    setTimeout(() => {
                        this.mainSpinner.discard(true);
                        this.mainSpinner = null;
                    }, spinnerFadeTime+200);
                }
            });
        }
    }

    addListeners = () => {
        this.addListener({
            type: 'submit',
            fn: this.handleSubmit,
        });
    }

    init = (data) => {
        if(!data.local) {
            this._loadFormData(data.id);
        }
    }

    paint = (data) => {
        if(this.formSubmitted) {
            if(this.components[this.id+'-title']) this.components[this.id+'-title'].draw();
            this.components[this.id+'-msg-top'].draw({
                text: this._getTextData(data.afterSubmitMsg, data.afterSubmitMsgId),
            });
        } else {
            if(this.mainSpinner) {
                this.mainSpinner.draw();
                this.mainSpinner.showSpinner(true);
            }
            for(let i=0; i<this.componentsOrder.length; i++) {
                const key = this.componentsOrder[i];
                this.components[key].draw();
            }
        }
    }

    _createFormComponents(data) {
        let id, text;
        
        // Form message top
        id = this.id+'-msg-top';
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new Component({
            id, class: ['form-msg', 'form-msg-top']
        }));

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
            this.fieldsetIds.push(fieldsetId);

            fieldset.tag = 'fieldset';
            if(fieldset.disabled) fieldset.attributes = { disabled: '' };
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
        id = this.id + '-spinner-icon';
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new Spinner({
            id,
        }));

        // Submit button
        const button = data.submitButton;
        id = button.id || this.id+'-submit-button';
        this.submitButtonId = id;
        text = this._getTextData(button.label, button.labelId);
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new SubmitButton({
            id, text, class: button.class
        }));

        // Form message bottom
        id = this.id+'-msg-bottom';
        this.componentsOrder.push(id);
        this.components[id] = this.addChild(new Component({
            id, class: ['form-msg', 'form-msg-bottom']
        }));

        // Sending form State listener
        this.formState.addListener('sending', (newValue) => {
            this.components[this.id+'-spinner-icon'].showSpinner(newValue);
            if(newValue) {
                // Disable submit button and fields
                document.getElementById(this.submitButtonId).setAttribute('disabled', '');
                for(let i=0; i<this.fieldsetIds.length; i++) {
                    const elem = document.getElementById(this.fieldsetIds[i]);
                    elem.setAttribute('disabled', '');
                }
            } else {
                // Enable submit button and fields
                document.getElementById(this.submitButtonId).removeAttribute('disabled');
                for(let i=0; i<this.fieldsetIds.length; i++) {
                    for(let j=0; j<this.data.fieldsets.length; j++) {
                        if(this.data.fieldsets[j].id === this.fieldsetIds[i] && !this.data.fieldsets[j].disabled) {
                            const elem = document.getElementById(this.fieldsetIds[i]);
                            elem.removeAttribute('disabled');
                            break;
                        }
                    }
                }
            }
        });
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
                this._fieldDropdownErrorCheck({ val, id, field, fieldsetId });
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val,
                        id,
                        fieldsetId,
                        fieldErrors: this.fieldErrors,
                        field: this.components[id],
                        components: this.components,
                    });
                }
                this._displayFieldError(id);
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldDropdownErrorCheck;
        this.components[id]['displayFieldError'] = () => { this._displayFieldError(id); };
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
                this._fieldCheckboxErrorCheck({ val, id, field, fieldsetId });
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val,
                        id,
                        fieldsetId,
                        fieldErrors: this.fieldErrors,
                        field: this.components[id],
                        components: this.components,
                    });
                }
                this._displayFieldError(id);
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldCheckboxErrorCheck;
        this.components[id]['displayFieldError'] = () => { this._displayFieldError(id); };
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
            value: field.maxLength && field.initValue
                ? (field.initValue.substring(0, parseInt(field.maxLength)) || '')
                : field.initValue || '',
            password: field.password,
            field,
            changeFn: (e) => {
                const val = e.target.value;
                this._fieldTextInputErrorCheck({ val, id, field, fieldsetId });
                if(field.onChangeFn) {
                    field.onChangeFn({
                        val,
                        id,
                        fieldsetId,
                        fieldErrors: this.fieldErrors,
                        field: this.components[id],
                        components: this.components,
                    });
                }
                this._displayFieldError(id);
            },
        }));
        this.components[id]['fieldsetId'] = fieldsetId;
        this.components[id]['errorChecker'] = this._fieldTextInputErrorCheck;
        this.components[id]['displayFieldError'] = () => { this._displayFieldError(id); };
    }

    _fieldDropdownErrorCheck = (args) => {
        let { val, id, field, fieldsetId } = args;
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
            validationFns[field.validationFn]({
                val,
                id,
                fieldsetId,
                fieldErrors: this.fieldErrors,
                field,
                components: this.components,
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    _fieldCheckboxErrorCheck = (args) => {
        let { val, id, field, fieldsetId } = args;
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
            validationFns[field.validationFn]({
                val,
                id,
                fieldsetId,
                fieldErrors: this.fieldErrors,
                field,
                components: this.components,
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    _fieldTextInputErrorCheck = (args) => {
        let { val, id, field, fieldsetId } = args;
        val = val.trim();
        if(field.required && !val.length) {
            this.fieldErrors.set(id, {
                errorMsg: getText('required'),
                fieldsetId,
                id
            });
        } else if(val.length && val.length < field.minLength) {
            this.fieldErrors.set(id, {
                errorMsg: getText('minimum_x_characters', [field.minLength]),
                fieldsetId,
                id
            });
        } else if(field.email && val.length && !shared.parsers.validateEmail(val)) {
            this.fieldErrors.set(id, {
                errorMsg: getText('email_not_valid'),
                fieldsetId,
                id
            });
        } else if(val.length && field.regex) {
            const regex = new RegExp(field.regex);
            if(!regex.test(val.trim())) {
                const text = this._getTextData(field.regexErrorMsg, field.regexErrorMsgId) || '';
                this.fieldErrors.set(id, {
                    errorMsg: text,
                    fieldsetId,
                    id
                });
            } else {
                this.fieldErrors.set(id, false);
            }
        } else {
            this.fieldErrors.set(id, false);
        }
        if(field.validationFn) {
            if(!validationFns[field.validationFn]) {
                this.logger.error(`Could not find validationFn (id: ${field.validationFn}).`);
                throw new Error('Call stack');
            }
            validationFns[field.validationFn]({
                val,
                id,
                fieldsetId,
                fieldErrors: this.fieldErrors,
                field,
                components: this.components,
            });
        }
        this.fieldsetErrorCheck(fieldsetId);
    }

    fieldsetErrorCheck = (fieldsetId) => {
        const formErrorCssClass = this.cssClasses.formError;
        const fieldsetErrorCssClass = this.cssClasses.fieldsetError;
        const keys = this.fieldErrors.getKeys();
        const fieldsets = this.data.fieldsets;
        for(let i=0; i<fieldsets.length; i++) {
            // Clean all errors
            const elem = document.getElementById(fieldsets[i].id);
            if(elem) elem.classList.remove(fieldsetErrorCssClass);
        }
        this.elem.classList.remove(formErrorCssClass); // Clean form error class
        this._setFormMsg('');
        
        let formErrors = false;
        for(let i=0; i<keys.length; i++) {
            const err = this.fieldErrors.get(keys[i]);
            if(err.fieldsetId === fieldsetId) {
                // Set new field errors
                const elem = document.getElementById(fieldsetId);
                if(elem) elem.classList.add(fieldsetErrorCssClass);
                formErrors = true;
            }
        }
        
        if(formErrors) {
            this.elem.classList.add(formErrorCssClass); // Set form error class
            const text = this._getTextData(this.data.onErrorsMsg, this.data.onErrorsMsgId);
            if(text) this._setFormMsg(text);
        }
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

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.formSentOnce) {
            this.formSentOnce = true;
            this.elem.classList.add(this.cssClasses.formSent);
        }

        // Check form errors
        let formHasErrors = this._checkAllFieldErrors();

        if(!formHasErrors) {
            const fields = this.data.submitFields;
            const payload = {};
            for(let i=0; i<fields.length; i++) {
                payload[fields[i]] = this.components[fields[i]].value;
            }
            this._sendForm(payload);
        }
    }

    _sendForm = async payload => {
        this.formState.set('sending', true);
        try {
            payload.id = this.id;
            const url = _CONFIG.apiBaseUrl + (this.data.api || '/forms/filled');
            const response = await axios.post(url, payload);
            // this.logger.log('API RESPONSE', response);
            this.formState.set('sending', false);
            if(response.data && response.data.errors) {
                // Server side validation error
                const keys = Object.keys(response.data.errors);
                for(let i=0; i<keys.length; i++) {
                    let fieldsetId;
                    //Find fieldset
                    for(let f=0; f<this.data.fieldsets.length; f++) {
                        const fieldset = this.data.fieldsets[f];
                        for(let k=0; k<fieldset.fields.length; k++) {
                            const field = fieldset.fields[k];
                            if(field.id === keys[i]) {
                                fieldsetId = fieldset.id;
                                break;
                            }
                        }
                        if(fieldsetId) break;
                    }
                    this.fieldErrors.set(keys[i], {
                        errorMsgId: response.data.errors[keys[i]],
                        fieldsetId,
                    });
                    this._displayFieldError(keys[i]);
                    this.fieldsetErrorCheck(fieldsetId);
                }
            } else {
                // Success
                this._resetForm();
                const showOnlyMsg = this.data.afterSubmitShowOnlyMsg;  
                if(showOnlyMsg) {
                    this.formSubmitted = true;
                    this.reDrawSelf({
                        class: this.cssClasses.formSuccess,
                    });
                } else {
                    const text = this._getTextData(this.data.afterSubmitMsg, this.data.afterSubmitMsgId);
                    this._setFormMsg(text);
                }
                if(this.afterFormSentFn) {
                    this.afterFormSentFn(response, this);
                }
            }
        } catch(exception) {
            this.formState.set('sending', false);
            this._resetForm();
            this.formSubmitted = true;
            this.reDrawSelf({
                class: [this.cssClasses.formError, this.cssClasses.formSent],
            });
            this._setFormMsg(getText('form_submit_error'));
            this.logger.error('Form sending failed (Form Creator).', exception);
        }
    }

    _loadFormData = async id => {
        this.formState.set('getting', true);
        this.formState.set('sending', false);
        try {
            const url = _CONFIG.apiBaseUrl + '/forms/' + id;
            const response = await axios.get(url);
            // this.logger.log('API RESPONSE', response);
            this.data = Object.assign({}, this.data, response.data);
            this.formState.set('getting', false);
        } catch(exception) {
            this.formState.removeListener('getting');
            this.formState.set('getting', false);
            this.formSubmitted = true;
            this.template = `<div class="error-msg">${getText('could_not_get_form_data')}</div>`;
            this.reDrawSelf();
            this.logger.error('Form data retrieving failed (Form Creator).', exception, this);
        }
    }

    _checkAllFieldErrors = () => {
        let formHasErrors = false;
        for(let i=0; i<this.componentsOrder.length; i++) {
            const comp = this.components[this.componentsOrder[i]];
            if(comp.errorChecker) {
                if(!this.fieldErrors.get(comp.id)) { // This check is for server side errors
                    // Run this check only if there aren't any errors before (this would clear server side errors)
                    comp.errorChecker({ val: comp.value, id: comp.id, field: comp.data.field, fieldsetId: comp.fieldsetId});
                }
                this._displayFieldError(comp.id);
                if(this.fieldErrors.get(comp.id)) {
                    formHasErrors = true;
                }
            }
        }
        return formHasErrors;
    }

    _displayFieldError = (id) => {
        const msg = this.fieldErrors.get(id);
        if(!this.formSentOnce || !msg) {
            this.components[id].error(false);
            return;
        }
        if(typeof msg === 'string' || msg instanceof String) {
            this.components[id].error({ errorMsg: msg });
        } else {
            const text = this._getTextData(msg.errorMsg, msg.errorMsgId);
            this.components[id].error({ errorMsg: text });
        }
    }

    _setFormMsg = (msg, showOnlyTop) => {
        const showTop = this.data.showTopMsg;
        const showBottom = this.data.showBottomMsg;
        let elem;
        if(showOnlyTop || showTop !== false) {
            elem = document.getElementById(this.id+'-msg-top');
            if(elem) elem.innerText = msg;
        }
        if(showBottom !== false) {
            elem = document.getElementById(this.id+'-msg-bottom');
            if(elem) elem.innerText = showOnlyTop ? '' : msg;
        }
    }

    _resetForm = () => {
        this.formSentOnce = false;
        
        // Reset all values to initValues and errors to false
        for(let i=0; i<this.data.fieldsets.length; i++) {
            const fieldset = this.data.fieldsets[i];
            for(let j=0; j<fieldset.fields.length; j++) {
                const field = fieldset.fields[j];
                let isField = false;

                if(field.type === 'textinput') {
                    this.components[field.id].setValue(field.maxLength && field.initValue
                        ? (field.initValue.substring(0, parseInt(field.maxLength)) || '')
                        : field.initValue || '');
                    isField = true;
                } else if(field.type === 'checkbox') {
                    this.components[field.id].setValue(field.initValue ? true : false);
                    isField = true;
                } else if(field.type === 'dropdown') {
                    this.components[field.id].setValue(field.initValue);
                    isField = true;
                }

                if(isField) {
                    this.fieldErrors.set(field.id, false);
                    this.components[field.id].data.disabled = field.disabled;
                    this.components[field.id].rePaint();
                }
            }
            this.fieldsetErrorCheck(fieldset.id);
        }

        this.elem.classList.remove(this.cssClasses.formSent);
        this.elem.classList.remove(this.cssClasses.formError);
        this.elem.classList.remove(this.cssClasses.formSuccess)
    }
}

export default FormCreator;