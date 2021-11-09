import { Component } from "../../LIGHTER";
import FormCreator from "../forms/FormCreator";
const testFormData = require('../../shared').testFormData;

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.customForm = this.addChild(new FormCreator(testFormData));
    }

    paint = () => {
        this.customForm.draw();
    }

    afterRegister = () => {
        console.log('After register fired in NewUser.js view.');
    }
}

export default NewUser;