import Component from "../../Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
        this.appState = data.appState;
    }

    init(data) {
        this.Router = this.appState.get('Router');
        this.addListener({
            id: 'back-to-root-click',
            target: this.elem,
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