import { getText } from "../../helpers/lang";
import { saveToken } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";
import FormCreator from "../forms/FormCreator";
import LoginForm from "../forms/LoginForm";
import UniverseItem from "../widgets/listItems/UniverseItem";
import ListLoader from "../widgets/ListLoader";
import "./Landing.scss";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.loginForm = this.addChild(new LoginForm({
            afterLoginFn: this.afterLogin,
        }));
        this.mainScreenInitiated = false;
        this.mainScreenCompos = [];
    }

    initMainScreen = () => {
        if(this.mainScreenInitiated) return;
        this.mainScreenCompos.push(this.addChild(new Component({ id: 'universe-wrapper' })));
        this.mainScreenCompos.push(this.addChild(new Button({
            id: 'add-uni-button',
            attach: 'universe-wrapper',
            text: 'Add Universe',
            click: (e) => {
                this.appState.get('Dialog').appear({
                    component: new FormCreator({
                        id: 'new-universe-form',
                        afterFormSentFn: () => {
                            this.appState.get('Dialog').disappear();
                            this.universesList.updateList();
                        },
                    }),
                    title: getText('create_new_universe'),
                });
            },
        })));
        this.universesList = this.addChild(new ListLoader({
            id: 'universes-list',
            api: 'universes',
            component: UniverseItem,
        }));
        this.mainScreenCompos.push(this.universesList);
    }

    paint = () => {
        if(this.appState.get('user.loggedIn')) {
            this.initMainScreen();
            for(let i=0; i<this.mainScreenCompos.length; i++) {
                this.mainScreenCompos[i].draw();
            }
        } else {
            this.elem.classList.add('login-view');
            this.loginForm.draw();
        }
    }

    afterLogin = (response, remember) => {
        saveToken(response, remember);
        this.appState.set('user.username', response.data.username);
        this.appState.set('user.token', response.data.token);
        this.appState.set('user.loggedIn', true);
    }
}

export default Landing;