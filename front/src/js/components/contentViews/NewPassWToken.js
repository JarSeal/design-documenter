import { getText } from '../../helpers/lang';
import { Component } from '../../LIGHTER';
import FormCreator from '../forms/FormCreator';
import ViewTitle from '../widgets/ViewTitle';

class NewPassWToken extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
            spinner: true,
        }));
        this.form;
        this.done = false;
    }

    init = () => {
        this.viewTitle.showSpinner(true);
        const token = this.Router.getRouteParams().token;
        console.log('TOKEN', token);

        this.form = this.addChild(new FormCreator({
            id: 'reset-password-w-token-form',
            appState: this.appState,
            afterFormSentFn: () => {
                this.done = true;
                this.rePaint();
            },
            // TODO: Add a onGetFormErrorFn
            editDataId: 'checkToken',
            addToMessage: { token },
        }));

        const updateMainMenu = this.appState.get('updateMainMenu');
        updateMainMenu({
            tools: [{
                id: 'to-login-button',
                type: 'button',
                text: getText('login'),
                click: () => {
                    this.Router.changeRoute('/login');
                },
            }],
        });
    }

    paint = () => {
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/', { replaceState: true });
            return;
        }
        this.viewTitle.draw();
        if(!this.done) {
            this.form.draw();
        } else {
            this.addChildDraw({
                id: 'password-reset-done-msg',
                text: getText('password_has_been_reset'),
            });
        }
    }
}

export default NewPassWToken;