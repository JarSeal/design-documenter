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
        this.curLang = getLang();
        console.log('CURLANG', this.curLang);
        this._createFormComponents(data);
    }

    paint = (data) => {
        const keys = Object.keys(this.components);
        for(let i=0; i<keys.length; i++) {
            this.components[keys[i]].draw();
        }
    }

    _createFormComponents(data) {
        let id, text;
        
        // Form title
        text = this._getTextData(data.formTitle, data.formTitleId);
        if(text) {
            id = this.id+'-title';
            this.components[id] = this.addChild(new Component({
                id, tag: 'h3', text, class: 'form-main-title'
            }));
        }

        // Fieldsets
        for(let i=0; i<data.fieldsets.length; i++) {

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