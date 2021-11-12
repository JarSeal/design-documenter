import Component from "../../LIGHTER/Component";

class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.template = `<button></button>`;
    }

    addListeners = () => {
        this.addListener({
            id: this.id + '-listener',
            type: 'click',
            fn: this.click,
        });
    }

    paint = (data) => {
        if(this.Router.isCurrent(data.link)) {
            this.elem.classList.add('current');
        } else {
            this.elem.classList.remove('current');
        }
    }

    click = (e) => {
        e.preventDefault();
        this.Router.changeRoute(this.data.link);
    }
}

export default RouteLink;