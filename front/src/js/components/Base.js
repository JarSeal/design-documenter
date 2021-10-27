import baseHTML from './base.html';
import Bbar from './bbar/Bbar';
import State from '../State';
import MainLoader from './loaders/MainLoader';

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
            }, 50);
        });
    }
}

export default Base;