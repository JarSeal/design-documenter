import { State, Component } from "../../lighter";
import axios from 'axios';
import SubmitButton from "./formComponents/SubmitButton";
import TextInput from "./formComponents/TextInput";
import { _CONFIG } from "../../_CONFIG";

class LoginForm extends Component {
    constructor(data) {
        super(data);
        this.template = `<form></form>`;
        this.appState = data.appState;

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
        console.log(this.loginState.get('user'), this.loginState.get('pass'));
        const username = this.loginState.get('user');
        const password = this.loginState.get('pass');
        this.login({ username, password });
    }

    login = async credentials => {
        try {
            const url = _CONFIG.apiBaseUrl + '/login';
            const response = await axios.post(url, credentials);
            this.loginState.set('user', '');
            this.loginState.set('pass', '');
            this.paint();
        } catch(exception) {
            console.log('Wrong username and/or password');
        }
    }
}

export default LoginForm;