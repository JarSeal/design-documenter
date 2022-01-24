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
        this.settingComponents = [];
    }

    init = () => {
        this._loadAdminSettings();
    }

    paint = () => {
        for(let i=0; i<this.settingComponents.length; i++) {
            this.settingComponents[i].draw();
        }
    }

    _loadAdminSettings = async () => {
        // Load form data
        let url = _CONFIG.apiBaseUrl + '/api/forms/admin-settings-form',
            formData, settingsData;
        let result = await axios.get(url, { withCredentials: true });
        if(result.data) {
            formData = result.data;
        } else {
            Logger.log('Could not retrieve admin settings form data.');
            return;
        }
        console.log('FORMDATA', formData);

        // Load current settings
        url = _CONFIG.apiBaseUrl + '/api/settings/admin';
        result = await axios.get(url, { withCredentials: true });
        if(result.data) {
            settingsData = result.data;
        } else {
            Logger.log('Could not retrieve admin settings form data.');
            return;
        }
        console.log('SETTINGSDATA', settingsData);

        this._createSettingComponents(formData, settingsData);
    }

    _createSettingComponents = (formData, settingsData) => {
        const fieldsets = formData.fieldsets;
        for(let i=0; i<this.settingComponents.length; i++) {
            if(this.settingComponents[i]) this.settingComponents[i].discard(true);
        }
        this.settingComponents = [];

        for(let i=0; i<fieldsets.length; i++) {
            const fs = fieldsets[i];
            for(let j=0; j<fs.fields.length; j++) {
                const fieldId = fs.fields[j].id;
                let value;
                for(let k=0; k<settingsData.length; k++) {
                    if(settingsData[k].settingId === fieldId) {
                        value = settingsData[k].value;
                        break;
                    }
                }
                this.settingComponents.push(this.addChild({ id: fieldId, text: value }));
            }
        }

        this.rePaint();
    }
}

export default AdminSettings;