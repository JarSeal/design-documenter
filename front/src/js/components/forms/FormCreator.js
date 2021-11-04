import { getLang, getText } from "../../helpers/lang";
import { Component, Logger } from "../../LIGHTER";

// Attributes for data (id will not be used, it comes from form data):
// - afterRegisterFn = function for after succesfull new user registering [function]
class FormCreator extends Component {
    constructor(data) {
        super(data);
        this.logger = new Logger('Form Creator *****');
        this._validateImportedFormData(data);
        this.template = `<form></form>`;
        this.components = {};
        this.componentsOrder = [];
        this.curLang = getLang();
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

    _validateImportedFormData(data) {
        if(!data.fieldsets || data.fieldsets.length === 0) {
            this.logger.error('Form data is missing a fieldset.');
            throw new Error('Call stack');
        }
    }
}

export default FormCreator;