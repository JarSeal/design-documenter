import { State, Component, Router } from './LIGHTER';
import Bbar from './components/bbar/Bbar';
import MainLoader from './components/loaders/MainLoader';
import { _CONFIG } from './_CONFIG';
import baseHTML from './base.html';
import './Base.scss';
import { getToken, removeToken } from './helpers/storage';
import { loadAssets } from './helpers/lang';
import Dialog from './components/widgets/Dialog';
import './components/widgets/Dialog.scss';

class Base extends Component {
    constructor(data) {
        super(data);
        this.template = baseHTML;
        this.appState = this._initAppState();
        loadAssets();
        this._initResizer();
        this.Router = new Router(
            _CONFIG,
            this.id,
            this.paint,
            { appState: this.appState, attach: 'content-area' }
        );
        this.bbar = this.addChild(new Bbar({ id: 'bbar', appState: this.appState }));
        this.mainLoader = this.addChild(new MainLoader({ id: 'main-loader', attach: 'overlays' }));
        this.dialog = this.addChild(new Dialog({ id: 'dialog', attach: 'overlays', appState: this.appState }));
        this.appState.set('dialog.Dialog', this.dialog);
        this.loadData();
    }

    paint = () => {
        if(this.appState.get('loading.main')) {
            if(this.mainLoader) this.mainLoader.draw();
        } else {
            if(this.mainLoader) this.mainLoader.discard(true);
            this.mainLoader = null;
            this.bbar.draw();
            this.Router.draw();
        }
    }

    _initAppState = () => {
        // Check if current browser has been used to log in
        let loggedIn = false,
            username = null,
            token = null;
        const user = getToken();
        if(user) {
            username = user.user;
            token = user.token;
            loggedIn = true;
        }

        // Init appState
        const state = new State({
            loading: { main: null },
            resizers: {},
            orientationLand: true,
            curRoute: '/',
            user: {
                loggedIn: loggedIn,
                username: username,
                token: token,
            },
            dialog: {
                show: false,
                content: null,
            },
        });
        state.set('loading.main', true, this.paint);
        state.addListener('user.loggedIn', this.listenLoggedStatus);
        state.addListener('dialog.show', this.listenDialogCommands);
        return state;
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.mainLoader.hide(() => {
                this.appState.set('loading.main', false);
            });
        }, 500);
    }

    _initResizer() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const resizers = this.appState.get('resizers');
                const keys = Object.keys(resizers);
                for(let i=0; i<keys.length; i++) {
                    resizers[keys[i]]();
                }
            }, 0);
        });
    }

    listenLoggedStatus = (loggedIn, oldValue) => {
        if(!loggedIn) {
            this.appState.set('user.username', null);
            this.appState.set('user.token', null);
            removeToken();
            this.Router.changeRoute('/', true);
            return;
        }
        this.paint();
    }

    listenDialogCommands = (show) => {
        if(show) {
            this.dialog.draw({ appear: true });
        }
    }
}

export default Base;