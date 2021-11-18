import { getAdminRights } from "../../helpers/storage";
import { Component } from "../../LIGHTER";

class Settings extends Component {
    constructor(data) {
        super(data);
        this.template = `<div><h2>${data.title}</h2></div>`;
    }

    init = async () => {
        console.log('Start');
        const isAdmin = await getAdminRights();
        console.log('End', isAdmin);
    }
}

export default Settings;