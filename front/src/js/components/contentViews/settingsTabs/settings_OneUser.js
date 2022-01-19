import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import { createDate } from "../../../helpers/date";
import FormCreator from "../../forms/FormCreator";
import Spinner from "../../widgets/Spinner";
import Button from "../../buttons/Button";
import './settings_OneUser.scss';
import Table from "../../widgets/Table";

class OneUser extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="one-user">' +
            '<div id="back-button-holder"></div>' +
            `<h2>${getText('user')}</h2>` +
        '</div>';
        this.userId;
        this.userData;
        this.Dialog = this.Router.commonData.appState.get('Dialog');
        this.appState = this.Router.commonData.appState;
        this.spinner = this.addChild(new Spinner({ id: 'user-loader-indicator' }));
        this.userDataElems = [];
        this.backButton = this.addChild(new Button({ // TODO MOVE TO OWN COMPONENT
            id: 'back-button',
            text: 'Back',
            noRedraws: true,
            attach: 'back-button-holder',
            click: () => { history.back(); },
        }));
    }

    init = () => {
        this.appState.get('updateMainMenu')({
            tools: [{
                id: 'edit-user-tool',
                type: 'button',
                text: 'Edit',
                click: () => {
                    if(!this.userData) return;
                    this.Dialog.appear({
                        component: FormCreator,
                        componentData: {
                            id: 'edit-user-form',
                            appState: this.appState,
                            editDataId: this.userData.id,
                            beforeFormSendingFn: () => {
                                this.Dialog.lock();
                            },
                            afterFormSentFn: () => {
                                this.Dialog.disappear();
                                // this._updateTable(); TODO: UPDATE VIEW
                            },
                            addToMessage: { userId: this.userData.id },
                            onErrorsFn: (ex, res) => {
                                this.Dialog.unlock();
                                // this._updateTable();
                                if(res && res.status === 401) this.Router.changeRoute('/');
                            },
                            onFormChages: () => { this.Dialog.changeHappened(); },
                            formLoadedFn: () => { this.Dialog.onResize(); },
                            extraButton: {
                                label: getText('cancel'),
                                class: 'some-class',
                                clickFn: (e) => {
                                    e.preventDefault();
                                    this.Dialog.disappear();
                                },
                            },
                        },
                        title: getText('edit_user') + ': ' + this.userData.username,
                    });
                }
            }, {
                id: 'user-logs-tool',
                type: 'button',
                text: 'Logs',
                click: () => {
                    if(!this.userData) return;
                    this.Dialog.appear({
                        component: LogsDialog,
                        componentData: {
                            id: 'user-logs-dialog',
                            userData: this.userData,
                        },
                    });
                }
            }]
        });
        this.userId = this.Router.getRouteParams().user;
        this._loadUserData();
    }

    paint = () => {
        this.backButton.draw();
        this.spinner.draw();
    }

    _loadUserData = async () => {
        this.usersData = null;
        this.spinner.showSpinner(true);
        const url = _CONFIG.apiBaseUrl + '/api/users' + '/' + this.userId;
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.userData = response.data;
            console.log('RECEIVED DATA', this.userData);
            this.spinner.showSpinner(false);
            this._createElements();
        }
        catch(exception) {
            this.spinner.showSpinner(false);
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
        }
    }

    _createElements = () => {
        const contentDefinition = [
            { id: 'username', tag: 'h1', label: getText('username') },
            { id: 'name', label: getText('name') },
            { id: 'email', label: getText('email') },
            { id: 'id', label: 'ID' },
            { id: 'userLevel', label: getText('user_level') },
            { id: 'created', label: getText('created') },
            { id: 'edited', label: getText('last_edited') },
            // { id: 'userGroups', label: getText('user_groups') },
        ];
        for(let i=0; i<contentDefinition.length; i++) {
            const item = contentDefinition[i];
            let value;
            let tag = 'div';
            if(item.tag) tag = item.tag;
            this.discardChild('user-data-' + item.id);
            
            if(item.id === 'created') {
                value = createDate(this.userData[item.id].date);
            } else if(item.id === 'edited' && this.userData[item.id][0]) {
                const lastIndex = this.userData[item.id].length - 1;
                value = createDate(this.userData[item.id][lastIndex].date);
            } else if(item.id === 'userLevel') {
                if(item.id === 'userLevel') value = getText('user_level_' + this.userData[item.id]);
            } else {
                value = this.userData[item.id];
            }
            if(!value.length) value = '&nbsp;';
            this.addChild({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label}</span>` +
                    `<${tag} class="user-data-item__value">${value}</${tag}>` +
                '</div>',
            }).draw();
        }
    }
}

export default OneUser;

class LogsDialog extends Component {
    constructor(data) {
        super(data);
        this.template = '<div>' +
            '<div class="created-wrapper">' +
                `<h3>${getText('created')}</h3>` +
            '</div>' +
            '<div class="edited-wrapper">' +
                `<h3>${getText('edited')}</h3>` +
            '</div>' +
        '</div>';
        this.editedTable = this.addChild(new Table({
            id: 'edited-logs-table',
            fullWidth: true,
            unsortable: true,
            tableData: this.data.userData.edited,
            tableStructure: this._getTableStructure(),
            rowClickFn: (e, rowData) => {
                this.Router.changeRoute('/settings/user/' + rowData.by.username, true);
            },
        }));
    }

    paint = () => {
        this.editedTable.draw();
    }

    _getTableStructure = () => {
        const structure = [
            {
                key: 'date',
                heading: getText('date'),
                sort: 'asc',
                type: 'Date',
            },
            {
                key: 'by.username',
                heading: getText('username'),
            },
        ];
        return structure;
    }
}