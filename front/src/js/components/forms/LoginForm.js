import Component from "../../lighter/Component";

class LoginForm extends Component {
    constructor(data) {
        super(data);
        this.template = `<div>
            <form id="login-form">
                <button type="submit">test</button>
            </form>
        </div>`;
    }

    paint = () => {
        this.addListener({
            id: 'login-form',
            type: 'submit',
            fn: this.handleLogin,
        });
    }

    handleLogin = (e) => {
        e.preventDefault();
        console.log('HERE', e);
    }
}

export default LoginForm;