import { Component } from "../../LIGHTER";
import Checkbox from "../forms/formComponents/Checkbox";
import Dropdown from "../forms/formComponents/Dropdown";
import TextInput from "../forms/formComponents/TextInput";
import FormCreator from "../forms/FormCreator";
import { newUserFormData } from "../forms/formData/newUserFormData";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        // newUserFormData.local = true;
        this.form = this.addChild(new FormCreator(newUserFormData));
    }

    paint = () => {
        this.form.draw();
    }
}

export default NewUser;