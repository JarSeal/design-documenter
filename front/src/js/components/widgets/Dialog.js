import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";

class Dialog extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = ``;
        this.transitionTime = 140; // in milliseconds
        data.style = { transitionDuration: this.transitionTime + 'ms' };

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
            click: this.closeDialog,
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
            fn: this.closeDialog,
        });
    }

    paint = (data) => {
        for(let i=0; i<this.dialogCompos.length; i++) {
            this.dialogCompos[i].draw();
        }
        if(data.appear) {
            setTimeout(() => {
                this.elem.classList.add('appear');
            }, 50);
        }
    }

    disappear = () => {
        this.elem.classList.remove('appear');
        setTimeout(() => {
            this.discard(true);
            this.appState.set('dialog.show', false);
        }, this.transitionTime);
    }

    closeDialog = (e) => {
        this.disappear();
    }
}

export default Dialog;