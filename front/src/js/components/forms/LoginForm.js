import { State, Component } from "../../LIGHTER";
import axios from 'axios';
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";
import { _CONFIG } from "../../_CONFIG";

// Attributes for data:
// - afterLoginFn = function for after succesfull login [function]
// - noRemember = do not save user info in Local Storage (only Session Storage) [boolean]
class LoginForm extends Component {
    constructor(data) {
        super(data);
        this.template = `<form></form>`;
        this.afterLoginFn = data.afterLoginFn;

        this.loginState = new State({
            user: '',
            pass: '',
        });

        this.userField = this.addChild(new TextInput({
            id: 'login-user-field',
            label: 'Username:',
            changeFn: (e) => { this.loginState.set('user', e.target.value); },
        }));
        this.passField = this.addChild(new TextInput({
            id: 'login-pass-field',
            label: 'Password:',
            password: true,
            changeFn: (e) => { this.loginState.set('pass', e.target.value); },
        }));
        this.submitButton = this.addChild(new SubmitButton({ id: 'login-submit', text: 'Login' }));
    }

    addListeners = () => {
        this.addListener({
            type: 'submit',
            fn: this.handleLogin,
        });
    }

    paint = () => {
        this.userField.draw({ value: this.loginState.get('user') });
        this.passField.draw({ value: this.loginState.get('pass') });
        this.submitButton.draw();
    }

    handleLogin = (e) => {
        e.preventDefault();
        
        const username = this.loginState.get('user');
        const password = this.loginState.get('pass');
        
        if(!username.trim().length || !password.trim().length) {
            console.log('Please provide username and password.');
            return;
        }
        this.login({ username, password });
    }

    login = async credentials => {
        try {
            const url = _CONFIG.apiBaseUrl + '/login';
            const response = await axios.post(url, credentials);
            this.loginState.set('user', '');
            this.loginState.set('pass', '');
            let remember = true; // Todo: add a checkbox for remember functionality
            if(this.afterLoginFn) {
                this.afterLoginFn(response, remember);
            }
        } catch(exception) {
            this.logger.log('Wrong username and/or password', exception);
        }
    }
}

export default LoginForm;