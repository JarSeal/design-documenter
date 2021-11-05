import { getText } from "../../../helpers/lang";
import { Component } from "../../../LIGHTER";

// Attributes:
// - label = field label [String]
// - name = input name property [String]
// - changeFn = function that is ran after each change [Function]
// - selected = value key tells which value is selected [String]
// - options = array of objects with value, label, disabled [Array[Object]]
// - emptyIsAnOption = [Boolean]
// - disabled = whether the field is disabled or not [Boolean]
// - error = an error boolean or object to tell if the field has errors {hasError:Boolean, errorMsg:String} [Boolean/Object]
class Dropdown extends Component {
    constructor(data) {
        super(data);
        if(!data.name) data.name = data.id;
        if(!data.label) data.label = data.id;
        this.selectId = this.id + '-select';
        this.options = [];
        this.template = `
            <div class="form-elem form-elem--dropdown">
                <label for="${this.selectId}">
                    <span class="form-elem__label">${data.label}</span>
                    <select
                        id="${this.selectId}"
                        class="form-elem__select"
                        type="checkbox"
                        name="${data.name}"
                        ${data.disabled ? 'disabled' : ''}
                    >${this._createOptionsTemplate(data.options, data.selected, data.emptyIsAnOption)}</select>
                </label>
            </div>
        `;
        this.value = data.selected;
        this.errorComp = this.addChild(new Component({
            id: this.id + '-error-msg',
            class: 'form-elem__error-msg',
        }));
        if(data.error) data.class = 'form-elem--error';
    }

    addListeners(data) {
        this.addListener({
            id: this.selectId + '-click',
            target: document.getElementById(this.selectId),
            type: 'click',
            fn: (e) => {
                this.value = e.target.value;
                data.selected = this.value;
                if(data.changeFn) data.changeFn(e);
            },
        });
    }

    paint(data) {
        const selectElem = document.getElementById(this.selectId);
        selectElem.checked = data.checked;
        if(data.error) {
            this.elem.classList.add('form-elem--error');
            if(data.error.errorMsg) {
                this.elem.classList.add('form-elem--error-msg');
                this.errorComp.draw({ text: data.error.errorMsg });
            }
        }
        if(data.disabled) selectElem.setAttribute('disabled', '');
    }

    error(err) {
        if(err) {
            this.errorComp.discard();
            this.elem.classList.add('form-elem--error');
            if(err.errorMsg) {
                this.elem.classList.add('form-elem--error-msg');
                this.errorComp.draw({ text: err.errorMsg });
            }
        } else {
            this.errorComp.discard();
            this.elem.classList.remove('form-elem--error');
            this.elem.classList.remove('form-elem--error-msg');
        }
    }

    setValue(newValue) {
        const opts = document.getElementById(this.selectId).children;
        const newVal = String(newValue);
        let valueFound = false;
        for(let i=0; i<opts.length; i++) {
            if(opts[i].value === newVal) {
                valueFound = true;
                this.value = newValue
                break;
            }
        }
        if(valueFound) {
            for(let i=0; i<opts.length; i++) {
                if(opts[i].value === newVal) {
                    opts[i].selected = true;
                } else {
                    opts[i].selected = false;
                }
            }
            if(this.data.changeFn) this.data.changeFn({ target: { value: this.value } });
        }
    }

    _createOptionsTemplate(options, selected, emptyIsAnOption) {
        let template = '';
        console.log(options);
        const selectedIsNotAValue = selected === undefined || selected === null;
        if(selectedIsNotAValue || emptyIsAnOption) {
            const selectedAttr = (emptyIsAnOption && selectedIsNotAValue) || selectedIsNotAValue
                ? ' selected'
                : '';
            console.log('selatrr', selectedAttr, (!selected || !selected.length), emptyIsAnOption);
            template += `<option value=""${selectedAttr}>[${getText('select')}]</option>`;
        }
        for(let i=0; i<options.length; i++) {
            template += '<option value="' + options[i].value + '"';
            if(options[i].disabled) template += ' disabled';
            if(selected && String(options[i].value) === String(selected)) template += ' selected';
            template += '>' + options[i].label + '</option>';
        }
        return template;
    }
}

export default Dropdown;