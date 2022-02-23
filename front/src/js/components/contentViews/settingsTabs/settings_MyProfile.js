import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import ReadApi from '../../forms/ReadApi';
import ViewTitle from '../../widgets/ViewTitle';
import Button from '../../buttons/Button';
import './settings_MyProfile.scss';
import DialogForms from '../../widgets/dialogs/dialog_Forms';
import Logs from '../Logs';
import FormCreator from '../../forms/FormCreator';
import { createDate } from '../../../helpers/date';

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
        this.viewTitle.showSpinner(false);
        if(this.data.redirectToLogin) {
            this.Router.changeRoute('/logout?r=' + this.Router.getRoute(true));
            return;
        };
        if(this.data.error) {
            this.addChildDraw({
                id: 'error-getting-my-profile',
                template: `<div class="error-text">${getText('could_not_get_data')}</div>`,
            });
            return;
        }

        this._createDialogButtons();
        this._createElements();
    }

    _createElements = () => {
        const contentDefinition = [
            { id: 'username', tag: 'h1', label: getText('username') },
            { id: 'name', label: getText('name') },
            { id: 'email', label: getText('email') },
            { id: 'id', label: 'ID' },
            { id: 'created', label: getText('created') },
            { id: 'edited', label: getText('last_edited') },
        ];
        for(let i=0; i<contentDefinition.length; i++) {
            const item = contentDefinition[i];
            let value = null;
            if(item.id === 'created') {
                value = createDate(this.data[item.id].date);
            } else if(item.id === 'edited' && this.data[item.id][0]) {
                const lastIndex = this.data[item.id].length - 1;
                value = createDate(this.data[item.id][lastIndex].date);
            } else {
                value = this.data[item.id];
            }
            this.addChildDraw({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label} <span class="user-data-item__label--exposure">${this._showExposure(item.id)}</span></span>` +
                    `<div class="user-data-item__value">${value || '&nbsp;'}</div>` +
                '</div>',
            });
        }
    }

    _showExposure = (id) => {
        if(this.data.exposure[id] === undefined || this.data.exposure[id] === 2) return `(${getText('view_right_2')})`;
        if(this.data.exposure[id] === 1) return `(${getText('view_right_1')})`;
        if(this.data.exposure[id] === 0) return `(${getText('view_right_0')})`;
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
                    title: getText('edit'),
                    editDataId: 'own',
                    afterFormSentFn: () => { this._loadMyData(); },
                    onErrorFn: () => { this._loadMyData(); },
                });
            },
        }));
        this.addChildDraw(new Button({
            id: 'my-profile-changepass-button',
            text: getText('change_password'),
            class: 'my-profile-button',
            attach: 'dialog-tools-wrapper',
            click: () => {
                this.Dialog.appear({
                    component: FormCreator,
                    componentData: {
                        id: 'change-password-form',
                        appState: this.appState,
                        beforeFormSendingFn: () => { this.Dialog.lock(); },
                        afterFormSentFn: () => {
                            this.Dialog.disappear();
                            this._loadMyData();
                        },
                        onErrorsFn: () => { this.Dialog.unlock(); },
                        formLoadedFn: () => { this.Dialog.onResize(); },
                    },
                    title: getText('change_password'),
                });
            },
        }));
        if(this.appState.get('serviceSettings.canSetExposure')) {
            this.addChildDraw(new Button({
                id: 'my-profile-exposure-button',
                text: getText('profile_exposure'),
                class: 'my-profile-button',
                attach: 'dialog-tools-wrapper',
                click: () => {
                    this.dialogForms.createEditDialog({
                        id: 'edit-expose-profile-form',
                        title: getText('profile_exposure'),
                        editDataId: 'own',
                        afterFormSentFn: () => { this._loadMyData(); },
                        onErrorFn: () => { this._loadMyData(); },
                    });
                },
            }));
        }
        this.addChildDraw(new Button({
            id: 'my-profile-logs-button',
            text: getText('logs'),
            class: 'my-profile-button',
            attach: 'dialog-tools-wrapper',
            click: () => {
                this.Dialog.appear({
                    component: Logs,
                    componentData: {
                        id: 'user-logs-dialog',
                        userData: this.data,
                    },
                    title: getText('logs'),
                });
            },
        }));
        this.addChildDraw(new Button({
            id: 'my-profile-delete-button',
            text: getText('delete'),
            class: 'my-profile-button',
            attach: 'dialog-tools-wrapper',
            click: () => {
                this.Dialog.appear({
                    component: FormCreator,
                    componentData: {
                        id: 'delete-profile-form',
                        appState: this.appState,
                        beforeFormSendingFn: () => {
                            const conf = window.confirm(getText('delete_profile_warning_text'));
                            if(conf) this.Dialog.lock();
                            return conf;
                        },
                        afterFormSentFn: () => {
                            this.Dialog.disappear();
                            this.Router.changeRoute('/logout');
                        },
                        onErrorsFn: (ex, res) => {
                            this.Dialog.unlock();
                        },
                        formLoadedFn: () => { this.Dialog.onResize(); },
                        extraButton: {
                            label: getText('cancel'),
                            clickFn: (e) => {
                                e.preventDefault();
                                this.Dialog.disappear();
                            },
                        },
                    },
                    title: getText('delete'),
                });
            },
        }));
    }
}

export default MyProfile;