import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";
import ViewTitle from "../widgets/ViewTitle";

class Login extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
        }));
        this.loginForm = this.addChild(new FormCreator({
            id: 'beacon-main-login',
            appState: this.appState,
            afterFormSentFn: this._afterLogin,
            addToMessage: {
                browserId: this.appState.get('browserId'),
            },
        }));
    }

    init = () => {
        const updateMainMenu = this.appState.get('updateMainMenu');
        updateMainMenu({
            tools: [{
                id: 'register-new-user-button',
                type: 'button',
                text: getText('new_user'),
                click: () => {
                    this.Router.changeRoute('/newuser');
                },
            }],
        });
    }

    paint = () => {
        this.viewTitle.draw();
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/');
        } else {
            this.loginForm.draw();
        }
    }

    _afterLogin = (response, remember) => {
        if(response && response.data && response.data.loggedIn) {
            this.appState.set('user.username', response.data.username);
            this.appState.set('user.loggedIn', true);
            this.appState.set('user.userLevel', response.data.userLevel);
            this.Router.changeRoute('/');
        }
    }
}

export default Login;