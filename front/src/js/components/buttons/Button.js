import Component from '../../LIGHTER/Component';

// Attributes:
// - click = clickFn
class Button extends Component {
    constructor(data) {
        super(data);
        this.template = '<button type="button"></button>';
        this.click = data.click;
    }

    init = () => {
        this.addListener({
            id: this.id + '-listener',
            type: 'click',
            fn: this.click,
        });
    }
}

export default Button;