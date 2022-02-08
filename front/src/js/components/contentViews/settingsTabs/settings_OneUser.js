import { Component, Logger } from '../../../LIGHTER';
import axios from 'axios';
import { getText } from '../../../helpers/lang';
import { _CONFIG } from '../../../_CONFIG';
import { createDate } from '../../../helpers/date';
import './settings_OneUser.scss';
import Table from '../../widgets/Table';
import FourOOne from '../FourOOne';
import FourOFour from '../FourOFour';
import RouteLink from '../../buttons/RouteLink';
import ViewTitle from '../../widgets/ViewTitle';
import DialogForms from '../../widgets/dialogs/dialog_Forms';

class OneUser extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="one-user">' +
            '<div id="back-button-holder"></div>' +
        '</div>';
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: getText('user'),
            spinner: true,
        }));
        this.userId;
        this.userData;
        this.Dialog = this.Router.commonData.appState.get('Dialog');
        this.appState = this.Router.commonData.appState;
        this.updateMainMenu = this.appState.get('updateMainMenu');
        this.userDataComps = [];
        this.dialogForms = new DialogForms({ id: 'dialog-forms-one-user' });
    }

    init = () => {
        this.updateMainMenu({
            backButton: true,
            tools: [{
                id: 'edit-user-tool',
                type: 'button',
                text: 'Edit',
                click: () => {
                    if(!this.userData) return;
                    this.dialogForms.createEditDialog({
                        id: 'edit-user-form',
                        title: getText('edit_user') + ': ' + this.userData.username,
                        editDataId: this.userData.id,
                        addToMessage: { userId: this.userData.id },
                        afterFormSentFn: () => { this._loadUserData(); },
                        onErrorFn: () => { this._loadUserData(); },
                    });
                },
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
                },
            }],
        });
        this.userId = this.Router.getRouteParams().user;
        this.viewTitle.draw();
        this._loadUserData();
    }

    _loadUserData = async () => {
        this.usersData = null;
        this.viewTitle.showSpinner(true);
        const url = _CONFIG.apiBaseUrl + '/api/users' + '/' + this.userId;
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.userData = response.data;
            this.viewTitle.showSpinner(false);
            this._createElements();
        }
        catch(exception) {
            this.viewTitle.showSpinner(false);
            const status = exception.response.status;
            this.appState.get('updateMainMenu')({ tools: [] });
            if(status === 401) {
                this.addChildDraw(new FourOOne({id:'one-user-401'}));
            } else if(status === 404) {
                this.addChildDraw(new FourOFour({
                    id:'one-user-404',
                    bodyText: getText('user_not_found'),
                }));
            } else {
                this.addChildDraw({
                    id: 'one-user-bigerror',
                    template: `<div><h2>${getText('error')}</h2></div>`,
                });
                const logger = new Logger('Get one user: *****');
                logger.error('Could not get users data', exception.response);
                throw new Error('Call stack');
            }
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
            
            if(this.userData[item.id] === undefined) {
                continue;
            } else if(item.id === 'created') {
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
            this.addChildDraw({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label}</span>` +
                    `<${tag} class="user-data-item__value">${value}</${tag}>` +
                '</div>',
            });
        }
    }

    _clearComps = () => {
        const comps = this.userDataComps;
        for(let i=0; i<comps.length; i++) {
            this.discardChild(comps[i].id);
        }
        this.userDataComps = [];
    }
}

export default OneUser;

class LogsDialog extends Component {
    constructor(data) {
        super(data);
        this.template = '<div>' +
            '<div class="created-wrapper" id="created-log">' +
                `<h3>${getText('created')}</h3>` +
            '</div>' +
            '<div class="edited-wrapper" id="edited-logs">' +
                `<h3>${getText('edited')}</h3>` +
            '</div>' +
        '</div>';
        this.addChild({
            id: 'created-elem',
            attach: 'created-log',
            template: '<div>' +
                `<span>${createDate(this.data.userData.created.date)}</span>` +
                (this.data.userData.created.publicForm
                    ? ` (${getText('public_form')})`
                    : ' by&nbsp;') +
            '</div>',
        });
        if(!this.data.userData.created.publicForm) {
            this.addChild(new RouteLink({
                id: 'created-by-user-link',
                link: '/settings/user/' + this.data.userData.created.by.username,
                text: this.data.userData.created.by.username,
                attach: 'created-elem',
                tag: 'a',
            }));
        }
        this.addChild(new Table({
            id: 'edited-logs-table',
            attach: 'edited-logs',
            fullWidth: true,
            unsortable: true,
            tableData: this.data.userData.edited,
            tableStructure: this._getTableStructure(),
            rowClickFn: (e, rowData) => {
                if(!rowData.by || !rowData.by.username) return;
                this.Router.changeRoute(
                    '/settings/user/' + rowData.by.username,
                    { forceUpdate: true }
                );
            },
        }));
    }

    paint = () => {
        this.drawChildren();
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