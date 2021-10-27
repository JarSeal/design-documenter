import baseHTML from './base.html';
import Bbar from './bbar/Bbar';
import State from '../State';
import MainLoader from './loaders/MainLoader';

class Base {
    constructor(parent) {
        parent.innerHTML = baseHTML;
        this.id = 'base-id';
        this.elem = document.getElementById(this.id);
        this.mainLoader = new MainLoader(
            document.getElementById('overlays')
        );
        this.appState = this.initAppState();
        this._initResizer();
        this.loadData();
    }

    initAppState() {
        const state = new State({
            loading: { main: null },
            resizers: {},
        });
        state.addListener('loading.main', this.loadingListener);
        state.set('loading.main', true);
        return state;
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.appState.set('loading.main', false);
        }, 1000);
    }

    loadingListener = (value, oldValue) => {
        console.log('Loading state changed!!!', value, oldValue);
        if(value === false) {
            this.mainLoader.hide(this.startApp);
            return;
        }
        this.mainLoader.toggle(value);
    }

    startApp = () => {
        new Bbar(this.appState, this.elem);
    }

    _initResizer() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const resizers = this.appState.get('resizers');
                const keys = Object.keys(resizers);
                console.log('keys', keys)
                // for(let i=0; i<fnsLength; i++) {
                //     fns[i](this.sceneState);
                // }
            }, 500);
        });
    }
}

export default Base;