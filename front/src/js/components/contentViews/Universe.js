import { Component } from "../../LIGHTER";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
    }

    paint = () => {
        this.elem.innerHTML += this.Router.curRouteData.params.universeId;
    }
}

export default NewUser;