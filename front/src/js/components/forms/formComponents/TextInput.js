import Component from "../../../LIGHTER/Component";

// Attributes:
// - value = value to display on the field
// - password = whether the input type is password [boolean]
// - label = field label [string]
// - name = input name property [string]
// - changeFn = function that is ran after each change [function]
// - disabled = whether the field is disabled or not [boolean]
class TextInput extends Component {
    constructor(data) {
        super(data);
        if(!data.name) data.name = data.id;
        if(!data.label) data.label = data.id;
        this.inputId = this.id + '-input';
        this.template = `
            <div class="form-elem form-elem--text-input">
                <label for="${this.inputId}">
                    <span class="form-elem__label">${data.label}</span>
                    <input
                        id="${this.inputId}"
                        class="form-elem__input"
                        type="${data.password ? 'password' : 'text'}"
                        name="${data.name}"
                        value="${data.value || ''}"
                    />
                </label>
            </div>
        `;
    }

    addListeners(data) {
        if(data.changeFn) {
            this.addListener({
                id: this.inputId + '-keyup',
                target: document.getElementById(this.inputId),
                type: 'keyup',
                fn: data.changeFn,
            });
        }
    }

    paint(data) {
        const inputElem = document.getElementById(this.inputId);
        inputElem.value = data.value;
        if(data.disabled) inputElem.setAttribute('disabled', '');
    }
}

export default TextInput;