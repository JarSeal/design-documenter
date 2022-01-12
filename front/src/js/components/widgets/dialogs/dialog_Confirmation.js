import { Component } from "../../../LIGHTER";
import { getText } from "../../../helpers/lang";
import Button from "../../buttons/Button";

// Attributes:
// - Dialog: Dialog class
// - message: String
// - confirmButtonText: String
// - confirmButtonFn: Function
// - cancelButtonText: String
// - cancelButtonFn: Function
// - noCancelButton: Boolean (hide cancel button)
class ConfirmationDialog extends Component {
    constructor(data) {
        super(data);
        this.Dialog = this.data.Dialog;
        this.template = '<div class="confirmation-dialog">' +
            `<p>${data.message}</p>` +
        '</div>';
    }

    paint = () => {
        if(!this.data.noCancelButton) {
            this.addChild(new Button({
                id: this.id + '-cancel-button',
                text: this.data.cancelButtonText || getText('cancel'),
                class: 'cancel-confirmation-button',
                click: () => {
                    if(this.data.cancelButtonFn) {
                        this.data.cancelButtonFn();
                    } else {
                        this.Dialog.disappear();
                    }
                },
            })).draw();
        }
        this.addChild(new Button({
            id: this.id + '-confirm-button',
            text: this.data.confirmButtonText || getText('confirm'),
            class: 'confirm-confirmation-button',
            click: () => {
                if(this.data.confirmButtonFn) {
                    this.data.confirmButtonFn();
                } else {
                    this.Dialog.disappear();
                }
            },
        })).draw();
    }
}

export default ConfirmationDialog;