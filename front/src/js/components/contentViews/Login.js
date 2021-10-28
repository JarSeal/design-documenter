import Component from "../../Component";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState;
    }

    init() {
        this.elem.innerHTML = `<div class="content">Login</div>`;
    }
}

export default Landing;