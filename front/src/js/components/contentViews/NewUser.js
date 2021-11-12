import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.form = this.addChild(new FormCreator({ id: 'new-user-form' }));
    }

    paint = () => {
        this.form.draw();
    }
}

export default NewUser;