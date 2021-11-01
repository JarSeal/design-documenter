import { State, Component, Router, LocalStorage } from './lighter';
import Bbar from './components/bbar/Bbar';
import MainLoader from './components/loaders/MainLoader';
import { _CONFIG } from './_CONFIG';
import baseHTML from './base.html';
import './Base.scss';

class Base extends Component {
    constructor(data) {
        super(data);
        this.template = baseHTML;
        this.LS = new LocalStorage(_CONFIG.lsKeyPrefix);
        this.appState = this._initAppState();
        this._initResizer();
        this.Router = new Router(_CONFIG.routes, this.id, this.paint, { appState: this.appState, attach: 'content-area' });
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
        let user = this.LS.getItem('beaconUser');
        let loggedIn = false,
            username = null,
            token = null;
        if(user) {
            const u = JSON.parse(user);
            username = u.user;
            token = u.token;
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
        } else {

        }
        this.paint();
    }
}

export default Base;