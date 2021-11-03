import { State, Component } from "../../LIGHTER";
import axios from 'axios';
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";
import { _CONFIG } from "../../_CONFIG";
import Spinner from "../widgets/Spinner";
import { getText } from "../../helpers/lang";

// Attributes for data (id is optional, default is 'bjs-new-user-form'):
// - afterRegisterFn = function for after succesfull new user registering [function]
class NewUserForm extends Component {
    constructor(data) {
        if(!data.id) data.id = 'bjs-new-user-form';
        super(data);
        this.template = `<form>
            <fieldset id="${data.id}-fieldset"></fieldset>
        </form>`;

        this.registerState = new State({
            username: '',
            password: '',
            checking: false,
        });

        const fieldsetId = data.id + '-fieldset';
        this.fieldsetId = fieldsetId;
        this.formMsg = this.addChild(new Component({
            id: this.id + '-form-msg',
            class: 'form-msg',
            attach: fieldsetId,
        }));
        this.userField = this.addChild(new TextInput({
            id: 'register-username-field',
            label: getText('username')+':',
            changeFn: (e) => { this.registerState.set('username', e.target.value); },
            attach: fieldsetId,
        }));
        this.passField = this.addChild(new TextInput({
            id: 'register-password-field',
            label: getText('password')+':',
            changeFn: (e) => { this.registerState.set('password', e.target.value); },
            attach: fieldsetId,
        }));
        this.spinner = this.addChild(new Spinner({
            id: this.id + '-spinner-icon',
            attach: fieldsetId,
        }));
        this.submitButton = this.addChild(new SubmitButton({
            id: 'register-submit',
            text: getText('create_new_user_button'),
            attach: fieldsetId,
        }));
    }

    paint = () => {
        if(this.registerState.get('checking')) {
            document.getElementById(this.fieldsetId).disabled = true;
        }
        this.formMsg.draw();
        this.userField.draw({ value: this.registerState.get('username') });
        this.passField.draw({ value: this.registerState.get('password') });
        this.spinner.draw();
        this.submitButton.draw();
    }
}

export default NewUserForm;