import bbar from './bbar.html';
import { _CONST } from '../../constants';
import './Bbar.scss';

class Bbar {
    constructor(appState, parent) {
        parent.innerHTML += bbar;
        this.elem = document.getElementById('bbar');
        appState.set(
            'resizers',
            appState.get('resizers').bbar = this.onResize
        );
        this.onResize();
    }

    onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.elem = document.getElementById('bbar');
        this.baseElem = document.getElementById('base-id');
        this.baseElem.style.transition = `
            margin-top 200ms ease-in-out,
            margin-left 200ms ease-in-out
        `;
        if(w > h) {
            this.elem.style.width = _CONST.bbarSize + 'px';
            this.elem.style.height = h + 'px';
            this.baseElem.classList.add('landscape');
            this.baseElem.classList.remove('portrait');
            this.baseElem.style.marginTop = _CONST.bbarSize + 'px';
            this.baseElem.style.marginLeft = 0;
        } else {
            this.elem.style.width = w + 'px';
            this.elem.style.height = _CONST.bbarSize + 'px';
            this.baseElem.classList.remove('landscape');
            this.baseElem.classList.add('portrait');
            this.baseElem.style.marginTop = 0;
            this.baseElem.style.marginLeft = _CONST.bbarSize + 'px';
        }
    }
}

export default Bbar;