import { Component } from "../../LIGHTER";
import NewUserForm from "../forms/NewUserForm";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.registerForm = this.addChild(new NewUserForm({
            afterRegisterFn: this.afterRegister,
        }));
    }

    paint = () => {
        this.registerForm.draw();
    }

    afterRegister = () => {
        console.log('After register fired in NewUser.js view.');
    }
}

export default NewUser;