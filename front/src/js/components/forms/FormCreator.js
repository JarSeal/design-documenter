import { getLang, getText } from "../../helpers/lang";
import { Component, Logger, State } from "../../LIGHTER";
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

        this._createFormComponents(data);
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
            }
        }
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
            label,
            class: field.class,
            placeholder,
            attach: fieldsetId,
            disabled: field.disabled,
            value: field.initValue || '',
            name: field.name || id,
            password: field.password,
            changeFn: (e) => {
                const val = e.target.value;
                if(field.required && !val.trim().length) {
                    this.fieldErrors.set(id, { errorMsg: getText('required') });
                    if(field.required !== true) { // field.required is a function then
                        field.required({ val, id, fieldsetId });
                    }
                } else {
                    this.fieldErrors.set(id, false);
                }
                if(field.onChangeFn) field.onChangeFn({ val, id, fieldsetId, errorStates: this.fieldErrors, field: this.components[id] });
                if(this.formSentOnce) this.components[id].error(this.fieldErrors.get(id));
            },
        }));
        
        // Missing: *****
        // minLength, maxLength, validationFn
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
}

export default FormCreator;