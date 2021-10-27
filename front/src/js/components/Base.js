import baseHTML from './base.html';
import Bbar from './bbar/Bbar';
import State from '../State';
import MainLoader from './loaders/MainLoader';
import Router from '../Router';
import { _CONST } from '../constants';
import './Base.scss';

class Base {
    constructor(parent) {
        this.id = 'base-id';
        this.parent = parent;
        this.appState;
        this.draw();
        this.appState = this.initAppState();
        this._initResizer();
        this.loadData();
    }

    draw() {
        this.parent.innerHTML = baseHTML;
        this.elem = document.getElementById(this.id);
        this.mainLoader = new MainLoader(
            document.getElementById('overlays')
        );
    }

    initAppState() {
        const state = new State({
            loading: { main: null },
            resizers: {},
            orientationLand: true,
        });
        state.set('Router', new Router(_CONST.routes));
        state.set('loading.main', true, this.loadingListener);
        return state;
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.appState.set('loading.main', false);
        }, 1000);
    }

    loadingListener = (value, oldValue) => {
        if(value === false) {
            this.mainLoader.hide(this.drawApp);
            return;
        }
        this.mainLoader.toggle(value);
    }

    drawApp = () => {
        new Bbar(this.appState, this.elem);
        const routeData = this.appState.get('Router').getRouteData();
        const contentElem = document.getElementById('content-area');
        console.log('ROUTEDATA', routeData);
        routeData.component.drawContent(this.appState, contentElem);
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