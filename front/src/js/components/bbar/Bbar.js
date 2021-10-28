import bbar from './bbar.html';
import { _CONST } from '../../_CONST';
import MainMenu from './MainMenu';
import './Bbar.scss';
import Component from '../../Component';

class Bbar extends Component {
    constructor(id, data) {
        super(id, data);
        this.template = bbar;

        this.appState = data.appState;

        this.mainMenu = this.addChild(new MainMenu('main-menu'));
    }

    init = (data) => {
        const resizers = this.appState.get('resizers');
        resizers.bbar = this.onResize;
        this.appState.set('resizers', resizers);
        this.onResize();

        console.log('DRAW main menu from bbar');
        this.mainMenu.draw();
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
}

export default Bbar;