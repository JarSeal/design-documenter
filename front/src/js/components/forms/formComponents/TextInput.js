import Component from "../../../LIGHTER/Component";

// Attributes:
// - value = value to display on the field [String]
// - password = whether the input type is password [Boolean]
// - label = field label [String]
// - name = input name property [String]
// - changeFn = function that is ran after each change [Function]
// - disabled = whether the field is disabled or not [Boolean]
// - error = an error boolean or object to tell if the field has errors {hasError:Boolean, errorMsg:String} [Boolean/Object]
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
                        ${data.disabled ? 'disabled' : ''}
                    />
                </label>
            </div>
        `;
        this.errorComp = this.addChild(new Component({
            id: this.id + '-error-msg',
            class: 'form-elem__error-msg',
        }));
        if(data.error) data.class = 'form-elem--error';
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
        if(data.error) {
            this.elem.classList.add('form-elem--error');
            if(data.error.errorMsg) {
                this.elem.classList.add('form-elem--error-msg');
                this.errorComp.draw({ text: data.error.errorMsg });
            }
        }
        if(data.disabled) inputElem.setAttribute('disabled', '');
    }
}

export default TextInput;