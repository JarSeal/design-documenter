import { Component } from "../../../LIGHTER";

class Checkbox extends Component {
    constructor(data) {
        super(data);
        if(!data.name) data.name = data.id;
        if(!data.label) data.label = data.id;
        this.inputId = this.id + '-input';
        this.template = `
            <div class="form-elem form-elem--checkbox">
                <label for="${this.inputId}">
                    <span class="form-elem__label">${data.label}</span>
                    <input
                        id="${this.inputId}"
                        class="form-elem__checkbox"
                        type="checkbox"
                        name="${data.name}"
                        ${data.checked ? 'checked' : ''}
                        ${data.disabled ? 'disabled' : ''}
                    />
                </label>
            </div>
        `;
    }

    addListeners(data) {
        if(data.changeFn) {
            this.addListener({
                id: this.inputId + '-click',
                target: document.getElementById(this.inputId),
                type: 'click',
                fn: data.changeFn,
            });
        }
    }

    paint(data) {
        const inputElem = document.getElementById(this.inputId);
        inputElem.checked = data.checked;
        if(data.disabled) inputElem.setAttribute('disabled', '');
    }
}

export default Checkbox;