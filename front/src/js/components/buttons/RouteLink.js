import Component from "../../LIGHTER/Component";

// Attributes:
// - link = String (Router link/path)
// - bypassCurrentCheck = Boolean (change route even if the target route is the same as the current one)
class RouteLink extends Component {
    constructor(data) {
        super(data);
        this.isCurrent = false;
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
            this.isCurrent = true;
        } else {
            this.elem.classList.remove('current');
            this.isCurrent = false;
        }
    }

    click = (e) => {
        e.preventDefault();
        if(this.isCurrent && !this.data.bypassCurrentCheck) return;
        this.Router.changeRoute(this.data.link, true);
    }
}

export default RouteLink;