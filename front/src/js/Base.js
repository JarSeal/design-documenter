import { State, Component, Router } from './LIGHTER';
import Bbar from './components/bbar/Bbar';
import MainLoader from './components/loaders/MainLoader';
import { _CONFIG } from './_CONFIG';
import baseHTML from './base.html';
import './Base.scss';
import { getToken, removeToken } from './helpers/storage';
import { loadAssets } from './helpers/lang';

class Base extends Component {
    constructor(data) {
        super(data);
        this.template = baseHTML;
        this.appState = this._initAppState();
        loadAssets();
        this._initResizer();
        this.Router = new Router(_CONFIG, this.id, this.paint, { appState: this.appState, attach: 'content-area' });
        this.bbar = this.addChild(new Bbar({ id: 'bbar', appState: this.appState }));
        this.mainLoader = this.addChild(new MainLoader({ id: 'main-loader', attach: 'overlays' }));
        this.loadData();
    }

    paint = () => {
        if(this.appState.get('loading.main')) {
            this.mainLoader.draw();
        } else {
            this.bbar.draw();
            this.Router.draw();
        }
    }

    _initAppState = () => {
        // Check if browser has been used to log in
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
            }
        });
        state.set('loading.main', true, this.paint);
        state.addListener('user.loggedIn', this.listenLoggedStatus);
        return state;
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.mainLoader.hide(() => {
                this.appState.set('loading.main', false);
            });
        }, 1000);
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
            this.Router.changeRoute('/');
            return;
        }
        this.paint();
    }
}

export default Base;