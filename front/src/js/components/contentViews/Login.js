import { saveUser } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.loginForm = this.addChild(new FormCreator({
            id: 'beacon-main-login',
            afterFormSentFn: this.afterLogin,
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
        saveUser(response, remember);
        this.appState.set('user.username', response.data.username);
        this.appState.set('user.token', response.data.token);
        this.appState.set('user.loggedIn', true);
    }
}

export default Landing;