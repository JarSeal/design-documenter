import Component from "../../Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
        this.appState = data.appState;
    }

    init(data) {
        this.addListener({
            id: 'back-to-root-click',
            type: 'click',
            fn: this.click,
        });
    }

    click = (e) => {
        e.preventDefault();
        console.log(this.Router, this.data.link);
        this.Router.changeRoute(this.data.link);
    }
}

export default RouteLink;