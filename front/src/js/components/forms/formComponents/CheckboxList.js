import { Component } from '../../../LIGHTER';

// Attributes for data:
// - label: String, (the main label for the checkboxlist)
// - changeFn: Function(selectors, lastChange)
// - selectors: Array[Object],
//     - key: String,
//     - label: String,
//     - selected: Boolean,
class CheckboxList extends Component {
    constructor(data) {
        super(data);
        this.label = data.label;
        this.template = `
            <div class="form-elem form-elem--checkboxlist">
                <label class="form-elem__label">${this.label}</label>
                <div class="form-elem__list-wrapper" id="${this.id}-list-wrapper"></div>
            </div>`;
    }

    paint = () => {
        
    }
}

export default CheckboxList;