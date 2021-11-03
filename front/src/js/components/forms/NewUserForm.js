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
            password2: '',
            checking: false,
        });
        this.formSentOnce = false;

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
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('username', val);
                this.userField.error(this._usernameErrors());
            },
            attach: fieldsetId,
        }));
        this.passField = this.addChild(new TextInput({
            id: 'register-password-field',
            label: getText('password')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('password', val);
                this.passField.error(this._passwordsErrors());
                this.passField2.error(this._passwordsErrors(true));
            },
            attach: fieldsetId,
        }));
        this.passField2 = this.addChild(new TextInput({
            id: 'register-password-field2',
            label: getText('password_again')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('password2', val);
                this.passField2.error(this._passwordsErrors(true));
            },
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

    addListeners = () => {
        this.addListener({
            type: 'submit',
            fn: this.handleNewUserSubmit,
        });
    }

    paint = () => {
        if(this.registerState.get('checking')) {
            document.getElementById(this.fieldsetId).disabled = true;
        }
        this.formMsg.draw();
        this.userField.draw({
            value: this.registerState.get('username'),
            error: this._usernameErrors(),
        });
        this.drawHTML({ attach: this.id + '-fieldset', class: 'form-divider' });
        this.passField.draw({
            value: this.registerState.get('password'),
            error: this._passwordsErrors(),
        });
        this.passField2.draw({
            value: this.registerState.get('password2'),
            error: this._passwordsErrors(true),
        });
        this.drawHTML({ attach: this.id + '-fieldset', class: 'form-divider' });

        this.spinner.draw();
        this.submitButton.draw();
    }

    handleNewUserSubmit = (e) => {
        e.preventDefault();
        this.formSentOnce = true;
        this.rePaint();
    }

    _usernameErrors() {
        if(!this.formSentOnce) return false;
        const user = this.registerState.get('username');
        if(!user.length) return { errorMsg: 'Required' }; 
    }

    _passwordsErrors(secondPass) {
        if(!this.formSentOnce) return false;
        const pass1 = this.registerState.get('password');
        const pass2 = this.registerState.get('password2');
        if(secondPass && !pass2.length) return { errorMsg: 'Required' };
        if(!secondPass && !pass1.length) return { errorMsg: 'Required' };
        if(pass1 === pass2) return false;
        if(secondPass) {
            return { errorMsg: 'Passwords don\'t match' };
        }
    }
}

export default NewUserForm;