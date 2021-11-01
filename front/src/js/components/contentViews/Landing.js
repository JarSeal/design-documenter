import Component from "../../lighter/Component";
import LoginForm from "../forms/LoginForm";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.appState = data.appState;
        this.loginForm = this.addChild(new LoginForm({ id: 'login-form', appState: data.appState }));
    }

    paint = () => {
        this.loginForm.draw();
    }
}

export default Landing;