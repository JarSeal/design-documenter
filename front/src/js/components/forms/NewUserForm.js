import { State, Component } from "../../LIGHTER";
import axios from 'axios';
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";
import { _CONFIG } from "../../_CONFIG";
import Spinner from "../widgets/Spinner";
import { getText } from "../../helpers/lang";
import { validateEmail } from "../../helpers/parsers";

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
            email: '',
            name: '',
            password: '',
            password2: '',
            checking: false,
        });
        this.formSentOnce = false;
        this.formErrors = {};

        const fieldsetId = data.id + '-fieldset';
        this.fieldsetId = fieldsetId;
        this.formMsg = this.addChild(new Component({
            id: this.id + '-form-msg',
            class: 'form-msg',
            attach: fieldsetId,
        }));
        this.userField = this.addChild(new TextInput({
            id: 'register-username-field',
            label: '* '+getText('username')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('username', val);
                this.userField.error(this._usernameErrors());
                this._checkAllErrors();
            },
            attach: fieldsetId,
        }));
        this.email = this.addChild(new TextInput({
            id: 'register-email-field',
            label: '* '+getText('email')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('email', val);
                this.email.error(this._emailErrors());
                this._checkAllErrors();
            },
            attach: fieldsetId,
        }));
        this.registerName = this.addChild(new TextInput({
            id: 'register-name-field',
            label: getText('name')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('name', val);
                this.registerName.error(this._nameErrors());
                this._checkAllErrors();
            },
            attach: fieldsetId,
        }));
        this.passField = this.addChild(new TextInput({
            id: 'register-password-field',
            label: '* '+getText('password')+':',
            password: true,
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('password', val);
                this.passField.error(this._passwordsErrors());
                this.passField2.error(this._passwordsErrors(true));
                this._checkAllErrors();
            },
            attach: fieldsetId,
        }));
        this.passField2 = this.addChild(new TextInput({
            id: 'register-password-field2',
            label: '* '+getText('password_again')+':',
            password: true,
            changeFn: (e) => {
                const val = e.target.value;
                this.registerState.set('password2', val);
                this.passField2.error(this._passwordsErrors(true));
                this._checkAllErrors();
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
        this.email.draw({
            value: this.registerState.get('email'),
            error: this._emailErrors(),
        });
        this.registerName.draw({
            value: this.registerState.get('name'),
            error: this._nameErrors(),
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
        this._usernameErrors();
        this._emailErrors();
        this._nameErrors();
        this._passwordsErrors();
        this._passwordsErrors(true);
        this._checkAllErrors();
    }

    _usernameErrors() {
        if(!this.formSentOnce) return false;
        const user = this.registerState.get('username');
        if(!user.length) {
            this.formErrors['username'] = true;
            return { errorMsg: getText('required') };
        } else {
            this.formErrors['username'] = false;
        }
    }

    _emailErrors() {
        if(!this.formSentOnce) return false;
        const email = this.registerState.get('email');
        if(!email.length) {
            this.formErrors['email'] = true;
            return { errorMsg: getText('required') };
        } else {
            // Check if email is a valid email here
            if(validateEmail(email)) {
                this.formErrors['email'] = false;
                return false;
            } else {
                this.formErrors['email'] = false;
                return { errorMsg: 'Email is invalid' };
            }
        }
    }

    _nameErrors() {
        if(!this.formSentOnce) return false;
        const name = this.registerState.get('name');
        if(!name.length) {
            this.formErrors['name'] = false;
            return false;
        } else {
            const minNameLength = 3;
            if(name.length < minNameLength) {
                this.formErrors['name'] = true;
                return { errorMsg: getText('minimum_x_characters', [minNameLength]) };
            }
            this.formErrors['name'] = false;
            return false;
        }
    }

    _passwordsErrors(secondPass) {
        if(!this.formSentOnce) return false;
        const pass1 = this.registerState.get('password');
        const pass2 = this.registerState.get('password2');
        if((secondPass && !pass2.length) || (!secondPass && !pass1.length)) {
            this.formErrors['password'] = true;
            return { errorMsg: getText('required') };
        }
        if(pass1 === pass2) {
            this.formErrors['password'] = false;
            return false;
        }
        if(secondPass) {
            this.formErrors['password'] = true;
            return { errorMsg: getText('passwords_dont_match') };
        }
    }

    _checkAllErrors() {
        const keys = Object.keys(this.formErrors);
        let noProblem = true;
        for(let i=0; i<keys.length; i++) {
            if(this.formErrors[keys[i]]) {
                noProblem = false;
                break;
            }
        }
        if(noProblem) {
            this.setMsg('');
        } else {
            this.setMsg(getText('fix_issues_on_form'));
        }
    }

    setMsg = (msg) => {
        const elem = this.formMsg.elem;
        if(msg.length) {
            elem.classList.add('show-msg');
        } else {
            elem.classList.remove('show-msg');
        }
        elem.innerText = msg;
    }
}

export default NewUserForm;