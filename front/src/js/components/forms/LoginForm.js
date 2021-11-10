import { State, Component } from "../../LIGHTER";
import axios from 'axios';
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";
import { _CONFIG } from "../../_CONFIG";
import Spinner from "../widgets/Spinner";
import { getText } from "../../helpers/lang";
import Checkbox from "./formComponents/Checkbox";

// Attributes for data (id is optional, default is 'bjs-login-form'):
// - afterLoginFn = function for after succesfull login [function]
// - noRemember = do not save user info in Local Storage (only Session Storage) [boolean]
class LoginForm extends Component {
    constructor(data) {
        if(!data.id) data.id = 'bjs-login-form';
        super(data);
        this.template = `<form></form>`;
        this.afterLoginFn = data.afterLoginFn;
        this.spinnerAnimTimer;

        this.loginState = new State({
            user: '',
            pass: '',
            rememberMe: false,
            checking: false,
        });
        this.formSentOnce = false;
        
        this.formMsg = this.addChild(new Component({
            id: this.id + '-form-msg',
            class: 'form-msg',
        }));
        this.userField = this.addChild(new TextInput({
            id: 'login-user-field',
            label: getText('username')+':',
            changeFn: (e) => {
                const val = e.target.value;
                this.loginState.set('user', val);
                if(this.formSentOnce) this.userField.error(!val.length);
            },
        }));
        this.passField = this.addChild(new TextInput({
            id: 'login-pass-field',
            label: getText('password')+':',
            password: true,
            changeFn: (e) => {
                const val = e.target.value;
                this.loginState.set('pass', val);
                if(this.formSentOnce) this.passField.error(!val.length);
            },
        }));
        this.rememberMe = this.addChild(new Checkbox({
            id: 'login-remember-me',
            label: getText('login_remember_me')+':',
            checked: false,
            changeFn: (e) => { this.loginState.set('rememberMe', e.target.checked) },
        }));
        this.spinner = this.addChild(new Spinner({
            id: this.id + '-spinner-icon',
        }));
        this.submitButton = this.addChild(new SubmitButton({
            id: 'login-submit',
            text: getText('login_button'),
        }));
    }

    addListeners = () => {
        this.addListener({
            type: 'submit',
            fn: this.handleLogin,
        });
        this.loginState.addListener('checking', (newValue) => {
            this.rePaint();
            this.spinner.showSpinner(newValue);
        });
    }

    paint = (data) => {
        this.formMsg.draw();
        this.userField.draw({
            value: this.loginState.get('user'),
            disabled: this.loginState.get('checking'),
            error: !this.loginState.get('user').length && this.formSentOnce
        });
        this.passField.draw({
            value: this.loginState.get('pass'),
            disabled: this.loginState.get('checking'),
            error: !this.loginState.get('pass').length && this.formSentOnce
        });
        if(!data.noRemember) {
            this.rememberMe.draw({
                checked: this.loginState.get('rememberMe'),
                disabled: this.loginState.get('checking'),
            });
        }
        this.drawHTML({ class: 'form-divider' });
        this.spinner.draw();
        this.submitButton.draw({ disabled: this.loginState.get('checking') });
    }

    handleLogin = (e) => {
        e.preventDefault();
        this.formSentOnce = true;
        this.elem.classList.add('form--sent');
        this.elem.classList.add('form--errors');
        
        this.setMsg('');
        const username = this.loginState.get('user');
        const password = this.loginState.get('pass');
        
        if(!username.trim().length || !password.trim().length) {
            this.rePaint();
            this.setMsg(getText('login_error_empty'));
            return;
        }
        this.login({ username, password });
    }

    login = async credentials => {
        this.loginState.set('checking', true);
        try {
            const url = _CONFIG.apiBaseUrl + '/login';
            const response = await axios.post(url, credentials);
            const remember = this.loginState.get('rememberMe');
            this.loginState.set('user', '');
            this.loginState.set('pass', '');
            this.loginState.set('rememberMe', false);
            this.loginState.set('checking', false);
            if(this.afterLoginFn) {
                this.afterLoginFn(response, remember);
            }
        } catch(exception) {
            this.loginState.set('checking', false);
            const msg = getText('login_error_wrong');
            this.setMsg(msg);
            this.logger.log(msg, exception);
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

export default LoginForm;