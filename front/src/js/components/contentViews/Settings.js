const { Component } = require("../../LIGHTER");

class Settings extends Component {
    constructor(data) {
        super(data);
        this.template = `<div><h2>${data.title}</h2></div>`;
    }
}

export default Settings;