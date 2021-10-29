import Component from "../../lighter/Component";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.appState;
    }

    init() {
        
    }
}

export default Landing;