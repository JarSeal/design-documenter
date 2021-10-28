import Component from "../../Component";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState;
    }

    draw(appState, parent) {
        this.appState = appState;
        parent.innerHTML = `<div class="content">Login</div>`;
    }

    discard() {
        // Remove listeners and other memory hogs when this content is not in view
    }
}

export default Landing;