import baseHTML from './base.html';
import Bbar from './bbar/Bbar';
import State from '../State';
import MainLoader from './loaders/MainLoader';

class Base {
    constructor(parent) {
        parent.innerHTML = baseHTML;
        this.id = 'base-id';
        this.elem = document.getElementById(this.id);
        this.mainLoader = new MainLoader(this.elem);
        this.appState = this.initAppState();
        new Bbar(this.appState, this.elem);
        this.loadData();
    }

    initAppState() {
        const state = new State({
            loading: { main: null }
        });
        state.addListener('loading.main', this.loadingListener);
        state.set('loading.main', true);
        return state;
    }

    loadData() {
        // Mock data loading with setTimeout
        setTimeout(() => {
            this.appState.set('loading.main', false);
        }, 3000);
    }

    loadingListener = (value, oldValue) => {
        console.log('Loading state changed!!!', value, oldValue);
        this.mainLoader.toggle(value);
    }
}

export default Base;