import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import FormCreator from "../../forms/FormCreator";

class AdminSettings extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = [];
        this.Dialog = this.Router.commonData.appState.state.Dialog;
        this.appState = this.Router.commonData.appState;
    }

    paint = () => {
        this.addChild({ id:'test',text:'JOKFSUJFASHFH'}).draw();
    }

    _loadAdminSettings = () => {
        
    }
}

export default AdminSettings;