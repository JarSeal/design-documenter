import Component from "../../LIGHTER/Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
    }

    paint = (data) => {
        this.addListener({
            id: this.id + '-listener',
            type: 'click',
            fn: this.click,
        });
        if(data.link === this.Router.curRoute) {
            this.elem.classList.add('current');
        }
    }

    click = (e) => {
        e.preventDefault();
        this.Router.changeRoute(this.data.link);
    }
}

export default RouteLink;