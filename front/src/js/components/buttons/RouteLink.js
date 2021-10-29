import Component from "../../lighter/Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
        this.appState = data.appState;
    }

    paint = () => {
        this.addListener({
            id: 'back-to-root-click',
            type: 'click',
            fn: this.click,
        });
    }

    click = (e) => {
        e.preventDefault();
        this.Router.changeRoute(this.data.link);
    }
}

export default RouteLink;