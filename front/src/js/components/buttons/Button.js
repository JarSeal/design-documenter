import Component from "../../lighter/Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
        this.click = data.click;
    }

    paint = () => {
        this.addListener({
            id: this.id + '-listener',
            type: 'click',
            fn: this.click,
        });
    }
}

export default RouteLink;