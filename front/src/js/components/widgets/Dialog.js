import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";

// Attributes for data:
// 
class Dialog extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.transitionTime = 140; // in milliseconds
        data.style = { transitionDuration: this.transitionTime + 'ms' };
        data.class = 'alpha-black';
        this.isShowing = false;
        this.compoToShow;
        this.dialogTitle;
        this.resizeTimer;

        this.dialogCompos = [];
        this.dialogCompos.push(this.addChild(new Component({
            id: this.id + '-box-wrapper',
            class: 'dialog-box',
            style: { transitionDuration: this.transitionTime + 'ms' },
        })));
        this.dialogCompos.push(this.addChild(new Button({
            id: this.id + '-close-button',
            class: 'close-button',
            attach: this.id + '-box-wrapper',
            attributes: { title: getText('close_dialog') },
            click: this._closeDialogClick,
        })));
        this.dialogCompos.push(this.addChild(new Component({
            id: this.id + '-inner-scroller',
            class: 'inner-scroller',
            attach: this.id + '-box-wrapper',
        })));
        this.dialogCompos.push(this.addChild(new Component({
            id: this.id + '-inner-box',
            class: 'inner-box',
            attach: this.id + '-inner-scroller',
        })));
    }

    addListeners = () => {
        this.appState.set('resizers.dialog', this.onResize);

        this.addListener({
            id: this.id + '-background-click',
            type: 'click',
            fn: this._closeDialogClick,
        });
    }

    paint = (data) => {
        for(let i=0; i<this.dialogCompos.length; i++) {
            this.dialogCompos[i].draw();
        }
        if(this.dialogTitle) {
            this.dialogTitle.draw();
            this.elem.classList.add('has-title');
        }
        if(this.compoToShow) this.compoToShow.draw();
        if(data.appear) {
            setTimeout(() => {
                if(this.elem) this.elem.classList.add('appear');
            }, 20);
        }
        this._setSizes();
    }

    appear = (dialogData) => {
        this.compoToShow = this.addChild(dialogData.component);
        this.compoToShow.data.attach = this.id + '-inner-box';
        if(dialogData.title) {
            this.dialogTitle = this.addChild(new Component({
                id: this.id + '-main-title',
                class: 'main-title',
                tag: 'h3',
                text: dialogData.title,
                attach: this.id + '-box-wrapper',
            }));
        }
        this.draw({ appear: true });
        this.isShowing = true;
    }

    disappear = () => {
        if(!this.elem) return;
        this.elem.classList.remove('appear');
        this.isShowing = false;

        this.appState.remove('resizers.dialog');

        setTimeout(() => {
            this.discard(true);
        }, this.transitionTime);
    }

    _closeDialogClick = (e) => {
        const targetId = e.target.id;
        if(targetId === this.id || targetId === this.id+'-close-button') {
            this.disappear();
        }
    }

    _setSizes = () => {
        if(!this.elem) return;
        const titleElem = this.elem.querySelector('#'+this.id + '-main-title');
        const scrollElem = this.elem.querySelector('#'+this.id + '-inner-scroller');
        scrollElem.style.height = 'auto';
        let titleHeight = 0;
        if(titleElem) titleHeight = titleElem.offsetHeight
        const boxElem = this.elem.querySelector('#'+this.id + '-box-wrapper');
        boxElem.style.paddingTop = (titleHeight / 10) + 'rem';
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            scrollElem.style.height = ((boxElem.offsetHeight - titleHeight) / 10) + 'rem';
        }, 100);
    }

    onResize = () => {
        this._setSizes();
    }
}

export default Dialog;