import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";

class Login extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.loginForm = this.addChild(new FormCreator({
            id: 'beacon-main-login',
            appState: this.appState,
            afterFormSentFn: this.afterLogin,
            addToMessage: {
                browserId: this.appState.get('browserId'),
            },
        }));
    }

    paint = () => {
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/');
        } else {
            this.loginForm.draw();
        }
    }

    afterLogin = (response, remember) => {
        if(response && response.data && response.data.loggedIn) {
            this.appState.set('user.username', response.data.username);
            this.appState.set('user.loggedIn', true);
            this.appState.set('user.userLevel', response.data.userLevel);
            this.Router.changeRoute('/');
        }
    }
}

export default Login;