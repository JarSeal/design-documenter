import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";

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

        this.dialogCompos = [];
        this.dialogCompos.push(this.addChild(new Component({
            id: this.id + '-box-wrapper',
            class: 'dialog-box',
            style: { transitionDuration: this.transitionTime + 'ms' },
        })));
        this.dialogCompos.push(this.addChild(new Button({
            id: this.id + '-close-button',
            text: 'close',
            attach: this.id + '-box-wrapper',
            attributes: { title: getText('close_dialog') },
            click: this.closeDialogClick,
        })));
        this.dialogCompos.push(this.addChild(new Component({
            id: this.id + '-inner-box',
            attach: this.id + '-box-wrapper',
        })));
    }

    addListeners = () => {
        this.addListener({
            id: this.id + '-background-click',
            type: 'click',
            fn: this.closeDialogClick,
        });
    }

    paint = (data) => {
        for(let i=0; i<this.dialogCompos.length; i++) {
            this.dialogCompos[i].draw();
        }
        if(this.dialogTitle) this.dialogTitle.draw();
        if(this.compoToShow) this.compoToShow.draw();
        if(data.appear) {
            setTimeout(() => {
                if(this.elem) this.elem.classList.add('appear');
            }, 0);
        }
    }

    appear = (dialogData) => {
        this.compoToShow = this.addChild(dialogData.component);
        this.compoToShow.data.attach = this.id + '-inner-box';
        if(dialogData.title) {
            this.dialogTitle = this.addChild(new Component({
                id: this.id + '-main-title',
                tag: 'h3',
                text: dialogData.title,
                attach: this.id + '-inner-box',
            }));
        }
        this.draw({ appear: true });
        this.isShowing = true;
    }

    disappear = () => {
        if(!this.elem) return;
        this.elem.classList.remove('appear');
        this.isShowing = false;
        setTimeout(() => {
            this.discard(true);
        }, this.transitionTime);
    }

    closeDialogClick = (e) => {
        const targetId = e.target.id;
        if(targetId === this.id || targetId === this.id+'-close-button') {
            this.disappear();
        }
    }
}

export default Dialog;