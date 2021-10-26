import baseHTML from './base.html';
import Bbar from './bbar/Bbar';
import State from '../State';

class Base {
    constructor(parent) {
        parent.innerHTML = baseHTML;
        this.elem = document.getElementById('base-id');
        this.appState = this.initAppState();
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
        // Mock data loading
        setTimeout(() => {
            this.appState.set('loading.main', false);
            new Bbar(this.appState, this.elem);
        }, 3000);
    }

    loadingListener = (value) => {
        console.log('Loading state changed!!!', value);
    }
}

export default Base;