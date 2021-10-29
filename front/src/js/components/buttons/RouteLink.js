import Component from "../../lighter/Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
    }

    paint = () => {
        this.addListener({
            id: 'back-to-root-click',
            type: 'click',
            fn: this.click,
        });
    }

    click = (e) => {
        console.log('HERE');
        e.preventDefault();
        this.Router.changeRoute(this.data.link);
    }
}

export default RouteLink;