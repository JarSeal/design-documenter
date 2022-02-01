import { getText } from '../../helpers/lang';
import { Component, LocalStorage } from '../../LIGHTER';
import FormCreator from '../forms/FormCreator';
import ViewTitle from '../widgets/ViewTitle';

class Login extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.ls = new LocalStorage('bjs_');

        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
        }));

        const rememberedUser = {};
        const rememberUser = this.ls.getItem('u');
        if(rememberUser) {
            rememberedUser.username = rememberUser;
            rememberedUser['remember-me'] = true;
        }
        this.loginForm = this.addChild(new FormCreator({
            id: 'beacon-main-login',
            appState: this.appState,
            fieldInitValues: rememberedUser,
            afterFormSentFn: this._afterLogin,
            onErrorsFn: (error, response, setFormMsg) => {
                const cooldownTime = response.data.cooldownTime;
                if(cooldownTime) {
                    setFormMsg(getText('cooldown_login_message', [cooldownTime]));
                }
            },
            addToMessage: {
                browserId: this.appState.get('browserId'),
            },
        }));
    }

    init = () => {
        const publicUserRegistration = this.appState.get('serviceSettings')['canCreateUser'];
        if(publicUserRegistration) {
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
    }

    paint = () => {
        this.viewTitle.draw();
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/');
        } else {
            this.loginForm.draw();
        }
    }

    _afterLogin = (response) => {
        if(response && response.data && response.data.loggedIn) {
            this.appState.set('user.username', response.data.username);
            this.appState.set('user.loggedIn', true);
            this.appState.set('user.userLevel', response.data.userLevel);
            this.appState.set('serviceSettings', response.data.serviceSettings);
            if(response.data.rememberMe) {
                this.ls.setItem('u', response.data.username);
            } else {
                this.ls.removeItem('u');
            }
            this.Router.changeRoute('/');
        }
    }
}

export default Login;