import axios from 'axios';
import { Component, Logger } from '../../../LIGHTER';
import { _CONFIG } from '../../../_CONFIG';
import SettingsGroup from '../../widgets/SettingsGroup';

class MySettings extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = [];
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
        this.settingsComponents = [];
        this.settingsData = [];
    }

    init = () => {
        this._loadMySettings();
    }

    paint = () => {
        for(let i=0; i<this.settingsComponents.length; i++) {
            this.settingsComponents[i].draw();
        }
    }

    _loadMySettings = async () => {
        // Clear old components
        for(let i=0; i<this.settingsComponents.length; i++) {
            if(this.settingsComponents[i]) this.settingsComponents[i].discard(true);
        }
        this.settingsComponents = [];
        this.settingsData = [];

        // Load form data
        let url = _CONFIG.apiBaseUrl + '/api/forms/user-settings-form',
            formData, settingsData;
        let result = await axios.get(url, { withCredentials: true });
        if(result.data) {
            formData = result.data;
        } else {
            Logger.log('Could not retrieve user settings (My Settings) form data.');
            return;
        }

        // Load current settings
        url = _CONFIG.apiBaseUrl + '/api/settings';
        result = await axios.get(url, { withCredentials: true });
        if(result.data) {
            settingsData = result.data;
        } else {
            Logger.log('Could not retrieve admin settings data.');
            return;
        }

        this._createsettingsComponents(formData, settingsData);
    }

    _createsettingsComponents = (formData, settingsData) => {
        const fieldsets = formData.fieldsets;
        for(let i=0; i<fieldsets.length; i++) {
            const fs = fieldsets[i];
            const data = {
                fsId: fs.id,
                fsTitleId: fs.fieldsetTitleId,
                fsDescriptionId: fs.descriptionId,
                fields: [],
            };
            for(let j=0; j<fs.fields.length; j++) {
                const fieldId = fs.fields[j].id;
                let value, mongoId;
                for(let k=0; k<settingsData.length; k++) {
                    if(settingsData[k].settingId === fieldId) {
                        value = settingsData[k].value;
                        mongoId = settingsData[k].id;
                        break;
                    }
                }
                if(!value) value = fs.fields[j].defaultValue;
                data.fields.push({
                    id: fieldId,
                    mongoId,
                    type: fs.fields[j].type,
                    value,
                    labelId: fs.fields[j].labelId,
                    descriptionId: fs.fields[j].descriptionId,
                    defaultValue: fs.fields[j].defaultValue,
                    options: fs.fields[j].options,
                });
            }
            this.settingsData.push(data);
            this.settingsComponents.push(this.addChild(new SettingsGroup({
                id: 'user-settings-g-' + fs.id,
                settingsData: data,
                formId: 'user-settings-form',
                updateSettings: this._loadMySettings,
            })));
        }

        this.rePaint();
    }
}

export default MySettings;