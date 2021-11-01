import Component from "../../../lighter/Component";

// Attributes:
// - text = button label/text [string]
class SubmitButton extends Component {
    constructor(data) {
        super(data);
        this.template = `<button type="submit" class="form-elem form-elem--submit"></button>`;
    }
}

export default SubmitButton;