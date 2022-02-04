import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import SettingsGroup from '../../widgets/SettingsGroup';
import ViewTitle from '../../widgets/ViewTitle';
import ReadApi from '../../forms/ReadApi';

class MySettings extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = [];
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
        this.settingsComponents = [];
        this.settingsData = [];
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-sub-view-title',
            heading: getText('my_settings'),
            tag: 'h3',
            spinner: true,
        }));
        this.formDataApi = new ReadApi({ url: '/api/forms/user-settings-form' });
        this.settingsDataApi = new ReadApi({ url: '/api/settings' });
    }

    init = () => {
        this.viewTitle.draw();
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

        const formData = await this.formDataApi.getData();
        const settingsData = await this.settingsDataApi.getData();
        if(formData.error || settingsData.error) {
            this.viewTitle.showSpinner(false);
            this.addChild({
                id: 'error-getting-my-settings',
                template: `<div class="error-text">${getText('could_not_get_data')}</div>`,
            }).draw();
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
        this.viewTitle.showSpinner(false);
    }
}

export default MySettings;