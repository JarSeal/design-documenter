import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import ReadApi from '../../forms/ReadApi';
import ViewTitle from '../../widgets/ViewTitle';
import Button from '../../buttons/Button';
import './settings_MyProfile.scss';
import DialogForms from '../../widgets/dialogs/dialog_Forms';

class MyProfile extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-sub-view-title',
            heading: getText('my_profile'),
            tag: 'h3',
            spinner: true,
        }));
        this.data;
        this.readApi = new ReadApi({ url: '/api/users/own/profile' });
        this.dialogForms = new DialogForms({ id: 'dialog-forms-my-profile' });
        this.dataComps = [];
    }

    init = () => {
        this.viewTitle.draw();
        this._loadMyData();
    }

    _loadMyData = async () => {
        this.viewTitle.showSpinner(true);

        this.data = await this.readApi.getData();
        if(this.data.error) {
            this.viewTitle.showSpinner(false);
            this.addChildDraw({
                id: 'error-getting-my-profile',
                template: `<div class="error-text">${getText('could_not_get_data')}</div>`,
            });
        }

        this.viewTitle.showSpinner(false);
        this._createDialogButtons();
        this._createElements();
    }

    _createElements = () => {
        const contentDefinition = [
            { id: 'username', tag: 'h1', label: getText('username') },
            { id: 'name', label: getText('name') },
            { id: 'email', label: getText('email') },
        ];
        for(let i=0; i<contentDefinition.length; i++) {
            const item = contentDefinition[i];
            this.addChildDraw({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label}</span>` +
                    `<div class="user-data-item__value">${this.data[item.id]}</div>` +
                '</div>',
            });
        }
    }

    _createDialogButtons = () => {
        this.addChildDraw({
            id: 'dialog-tools-wrapper',
            class: 'dialog-tools-wrapper',
        });
        this.addChildDraw(new Button({
            id: 'my-profile-edit-button',
            text: getText('edit'),
            class: 'my-profile-button',
            attach: 'dialog-tools-wrapper',
            click: () => {
                this.dialogForms.createEditDialog({
                    id: 'edit-profile-form',
                    title: getText('edit_user'),
                    afterFormSentFn: () => { this._loadMyData(); },
                    onErrorFn: () => { this._loadMyData(); },
                });
            },
        }));
        
    }
}

export default MyProfile;