import { Component } from "../../LIGHTER";
import Checkbox from "../forms/formComponents/Checkbox";
import Dropdown from "../forms/formComponents/Dropdown";
import TextInput from "../forms/formComponents/TextInput";
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
            value: 3,
            options: [
                { value: '1', label: 'One' },
                { value: '2', label: 'Two' },
                { value: '3', label: 'Three' },
                { value: '4', label: 'Four', disabled: true },  
            ],
            changeFn: (e) => {
                console.log('here', e.target.value);
            },
        }));
        this.checkbox = this.addChild(new Checkbox({
            id: 'jotain',
            changeFn: (e) => {
                console.log('chec', e.target.checked);
            },
        }));
        this.textInput = this.addChild(new TextInput({
            id: 'textinput',
            placeholder: 'Some placeholder..',
            changeFn: (e) => {
                console.log('textInputter', e.target.value);
            },
        }));
    }

    paint = () => {
        // this.registerForm.draw();
        // this.customForm.draw();
        this.dropdown.draw();
        this.checkbox.draw();
        this.textInput.draw();
        setTimeout(() => {
            this.dropdown.setValue(1);
            this.checkbox.setValue(true, true);
            // this.textInput.setValue('UUsi arvo', true);
        }, 4000);
    }

    afterRegister = () => {
        console.log('After register fired in NewUser.js view.');
    }
}

export default NewUser;