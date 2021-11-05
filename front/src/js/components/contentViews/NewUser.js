import { Component } from "../../LIGHTER";
import Dropdown from "../forms/formComponents/Dropdown";
import FormCreator from "../forms/FormCreator";
import { testFormData } from "../forms/formData/testFormData";
import NewUserForm from "../forms/NewUserForm";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        // this.registerForm = this.addChild(new NewUserForm({
        //     afterRegisterFn: this.afterRegister,
        // }));
        this.customForm = this.addChild(new FormCreator(testFormData));
        this.dropdown = this.addChild(new Dropdown({
            id: 'some-dropdown',
            label: 'My dropdown:',
            name: 'some-dropdown',
            emptyIsAnOption: true,
            selected: 2,
            options: [
                { value: '1', label: 'One' },
                { value: '2', label: 'Two' },
                { value: '3', label: 'Three' },
                { value: '4', label: 'Four', disabled: true },  
            ],
            changeFn: (e) => {
                console.log('here');
            },
        }));
    }

    paint = () => {
        // this.registerForm.draw();
        // this.customForm.draw();
        this.dropdown.draw();
    }

    afterRegister = () => {
        console.log('After register fired in NewUser.js view.');
    }
}

export default NewUser;