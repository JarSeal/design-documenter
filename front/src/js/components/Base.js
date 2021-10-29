import State from '../State';
import Component from '../Component';
import Router from '../Router';
import Bbar from './bbar/Bbar';
import MainLoader from './loaders/MainLoader';
import { _CONFIG } from '../_CONFIG';
import baseHTML from './base.html';
import './Base.scss';

class Base extends Component {
    constructor(data) {
        super(data);
        this.template = baseHTML;
        this.appState = this._initAppState();
        this._initResizer();
        this.Router = new Router(_CONFIG.routes, this.id, this.rcCallback, { appState: this.appState, attach: 'content-area' });
        this.bbar = this.addChild(new Bbar({ id: 'bbar', attach: 'overlays', appState: this.appState }));
        this.draw();
    }

    init() {
        this.drawApp();
    }

    _initAppState() {
        const state = new State({
            loading: { main: null },
            resizers: {},
            orientationLand: true,
            curRoute: '/',
        });
        // state.set('loading.main', true, this.loadingListener);
        return state;
    }

    rcCallback = (newRoute) => {
        this.drawApp();
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.appState.set('loading.main', false);
        }, 1000);
    }

    loadingListener = (value, oldValue) => {
        
    }

    drawApp = () => {
        this.bbar.draw();
        this.Router.drawView();
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
}

export default Base;