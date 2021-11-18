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
        if(this.appState.get('user.loggedIn')) {
            this.Router.changeRoute('/');
        } else {
            this.form.draw();
        }
    }
}

export default NewUser;