import axios from 'axios';
import { Component, Logger } from '../../../LIGHTER';
import { _CONFIG } from '../../../_CONFIG';
import SettingsGroup from '../../widgets/SettingsGroup';
import optionsFns from '../../forms/formData/optionsFns';

class AdminSettings extends Component {
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
        this._loadAdminSettings();
    }

    paint = () => {
        for(let i=0; i<this.settingsComponents.length; i++) {
            this.settingsComponents[i].draw();
        }
    }

    _loadAdminSettings = async () => {
        // Clear old components
        for(let i=0; i<this.settingsComponents.length; i++) {
            if(this.settingsComponents[i]) this.settingsComponents[i].discard(true);
        }
        this.settingsComponents = [];
        this.settingsData = [];

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

        // Load current settings
        url = _CONFIG.apiBaseUrl + '/api/settings/admin';
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
                let options = fs.fields[j].options;
                if(fs.fields[j].getOptionsFn) {
                    options = optionsFns[fs.fields[j].getOptionsFn]({
                        readerLevel: this.appState.get('user.userLevel'),
                    });
                }
                data.fields.push({
                    id: fieldId,
                    mongoId,
                    type: fs.fields[j].type,
                    value,
                    labelId: fs.fields[j].labelId,
                    descriptionId: fs.fields[j].descriptionId,
                    defaultValue: fs.fields[j].defaultValue,
                    options,
                });
            }
            this.settingsData.push(data);
            this.settingsComponents.push(this.addChild(new SettingsGroup({
                id: 'admin-settings-g-' + fs.id,
                settingsData: data,
                formId: 'admin-settings-form',
                updateSettings: this._loadAdminSettings,
            })));
        }

        this.rePaint();
    }
}

export default AdminSettings;