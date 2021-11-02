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
                    />
                </label>
            </div>
        `;
    }
}

export default Checkbox;