import { Component, LocalStorage } from "../../lighter";
import { _CONFIG } from "../../_CONFIG";
import LoginForm from "../forms/LoginForm";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.loginForm = this.addChild(new LoginForm({
            id: 'login-form',
            afterLoginFn: this.afterLogin,
        }));
    }

    paint = () => {
        if(this.appState.get('user.loggedIn')) {
            this.elem.innerHTML += 'LOGGED IN';
        } else {
            this.loginForm.draw();
        }
    }

    afterLogin = (response, remember) => {
        const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
        if(remember) {
            LS.setItem('beaconUser', JSON.stringify(response.data));
        } else {
            // TODO: implement session storage here..
        }
        this.appState.set('user.username', response.data.username);
        this.appState.set('user.token', response.data.token);
        this.appState.set('user.loggedIn', true);
    }
}

export default Landing;