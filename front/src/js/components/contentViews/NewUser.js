import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.form = this.addChild(new FormCreator({
            id: 'new-user-form',
            appState: this.appState,
        }));
    }

    init = () => {
        const updateMainMenu = this.appState.get('updateMainMenu');
        updateMainMenu({
            tools: [{
                id: 'to-login-button',
                type: 'button',
                text: getText('login'),
                click: () => {
                    this.Router.changeRoute('/');
                },
            }],
        });
    }

    paint = () => {
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/');
        } else {
            this.form.draw();
        }
    }
}

export default NewUser;