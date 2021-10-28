import bbar from './bbar.html';
import { _CONST } from '../../constants';
import './Bbar.scss';

class Bbar {
    constructor(appState, parent) {
        this.appState = appState;
        
        parent.innerHTML += bbar;
        this.elem = document.getElementById('bbar');
        
        const resizers = appState.get('resizers');
        resizers.bbar = this.onResize;
        appState.set('resizers', resizers);
        
        this.onResize();
    }

    onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.elem = document.getElementById('bbar');
        this.baseElem = document.getElementById('base-id');
        if(w > h) {
            this.elem.style.width = _CONST.bbarSize + 'px';
            this.elem.style.height = h + 'px';
            this.baseElem.classList.add('landscape');
            this.baseElem.classList.remove('portrait');
            this.baseElem.style.marginTop = 0;
            this.baseElem.style.marginLeft = _CONST.bbarSize + 'px';
            this.appState.set('orientationLand', true);
        } else {
            this.elem.style.width = w + 'px';
            this.elem.style.height = _CONST.bbarSize + 'px';
            this.baseElem.classList.remove('landscape');
            this.baseElem.classList.add('portrait');
            this.baseElem.style.marginTop = _CONST.bbarSize + 'px';
            this.baseElem.style.marginLeft = 0;
            this.appState.set('orientationLand', false);
        }
    }

    discard() {

    }
}

export default Bbar;