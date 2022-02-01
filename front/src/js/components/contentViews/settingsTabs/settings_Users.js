import { Component, LocalStorage, Logger, SessionStorage } from '../../../LIGHTER';
import axios from 'axios';
import { getText } from '../../../helpers/lang';
import { _CONFIG } from '../../../_CONFIG';
import Table from '../../widgets/Table';
import FormCreator from '../../forms/FormCreator';
import { getHashCode } from '../../../helpers/storage';

class UsersList extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = [];
        this.Dialog = this.Router.commonData.appState.state.Dialog;
        this.appState = this.Router.commonData.appState;
        const tableSortingSetting = this.appState.get('serviceSettings')['tableSorting'];
        let storage;
        if(tableSortingSetting === 'session') {
            storage = new SessionStorage('bjs_');
        } else if(tableSortingSetting === 'browser') {
            storage = new LocalStorage('bjs_');
        }
        let username, storageHandle, params;
        if(storage) {
            username = this.appState.get('user.username');
            storageHandle = getHashCode(username + data.id);
            params = JSON.parse(storage.getItem(storageHandle));
        }
        this.usersTable = this.addChild(new Table({
            id: 'users-table',
            fullWidth: true,
            tableData: this.users,
            showStats: true,
            selectable: true,
            showRowNumbers: true,
            showGroupSize: 25,
            tableParams: params,
            afterChange: (data) => {
                if(!username || !storage) return;
                const dataString  = JSON.stringify(data);
                storage.setItem(storageHandle, dataString);
            },
            filterHotkey: 'f',
            filter: true,
            tableStructure: this._getTableStructure(),
            rowClickFn: (e, rowData) => {
                this.Router.changeRoute('/settings/user/' + rowData.username);
            },
            tools: [{
                id: 'multi-delete-tool',
                text: getText('delete'),
                clickFn: (e, selected) => {
                    if(!selected.length) return;
                    this.Dialog.appear({
                        component: FormCreator,
                        componentData: {
                            id: 'delete-users',
                            appState: this.appState,
                            formDesc: getText('delete_many_users_confirmation')+'\n'+this._listUsernames(selected),
                            beforeFormSendingFn: () => {
                                this.Dialog.lock();
                            },
                            afterFormSentFn: () => {
                                for(let i=0; i<selected.length; i++) {
                                    this.usersTable.removeSelectedByTableIndex(selected[i]._tableIndex);
                                }
                                this.Dialog.disappear();
                                this._updateTable();
                            },
                            addToMessage: {
                                users: selected.map(sel => sel.id),
                            },
                            onErrorsFn: (ex, res) => {
                                this.Dialog.unlock();
                                this._updateTable();
                                if(res && res.status === 401) this.Router.changeRoute('/');
                            },
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
                        title: getText('delete_users') + ': ',
                    });
                },
            }],
        }));
        this._loadUsers(true);
    }

    init = () => {
        const canCreateUser = this.appState.get('serviceSettings')['canCreateUser'];
        if(canCreateUser) {
            const updateMainMenu = this.appState.get('updateMainMenu');
            updateMainMenu({
                tools: [{
                    id: 'register-new-user-tool-button',
                    type: 'button',
                    text: getText('new_user'),
                    click: () => {
                        this.Dialog.appear({
                            component: FormCreator,
                            componentData: {
                                id: 'new-user-form',
                                appState: this.appState,
                                beforeFormSendingFn: () => {
                                    this.Dialog.lock();
                                },
                                afterFormSentFn: () => {
                                    this.Dialog.disappear();
                                    this._updateTable();
                                },
                                onErrorsFn: (ex, res) => {
                                    this.Dialog.unlock();
                                    this._updateTable();
                                    if(res && res.status === 401) this.Router.changeRoute('/');
                                },
                                onFormChanges: () => { this.Dialog.changeHappened(); },
                                formLoadedFn: () => { this.Dialog.onResize(); },
                            },
                            title: getText('new_user'),
                        });
                    },
                }],
            });
        }
    }

    paint = () => {
        if(this.users.length) {
            this.usersTable.draw({ tableData: this.users });
        }
    }

    _loadUsers = async (rePaint) => {
        this.users = [];
        const url = _CONFIG.apiBaseUrl + '/api/users';
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.users = response.data;
            if(rePaint) this.rePaint();
        }
        catch(exception) {
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
        }
    }

    _deleteUsers = async (users) => {
        if(!users || !users.length) return;
        const url = _CONFIG.apiBaseUrl + '/api/users';
        try {
            const response = await axios.delete(url, { withCredentials: true, users });
            return response;
        }
        catch(exception) {
            const logger = new Logger('Delete users: *****');
            logger.error('Could not delete users', exception, users);
            throw new Error('Call stack');
        }
    }

    _getTableStructure = () => {
        const structure = [
            {
                key: 'username',
                heading: getText('username'),
                sort: 'desc',
            },
            {
                key: 'name',
                heading: getText('name'),
            },
            {
                key: 'email',
                heading: getText('email'),
            },
            {
                key: 'userLevel',
                heading: getText('user_level'),
            },
            {
                key: 'created.date',
                heading: getText('created'),
                type: 'Date',
            },
            {
                key: 'editUser',
                heading: getText('edit'),
                type: 'Action',
                actionFn: (e, rowData) => {
                    this.Dialog.appear({
                        component: FormCreator,
                        componentData: {
                            id: 'edit-user-form',
                            appState: this.appState,
                            editDataId: rowData.id,
                            beforeFormSendingFn: () => {
                                this.Dialog.lock();
                            },
                            afterFormSentFn: () => {
                                this.Dialog.disappear();
                                this._updateTable();
                            },
                            addToMessage: { userId: rowData.id },
                            onErrorsFn: (ex, res) => {
                                this.Dialog.unlock();
                                this._updateTable();
                                if(res && res.status === 401) this.Router.changeRoute('/');
                            },
                            onFormChanges: () => { this.Dialog.changeHappened(); },
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
                        title: getText('edit_user') + ': ' + rowData.username,
                    });
                },
            },
            {
                key: 'deleteUser',
                heading: getText('delete'),
                type: 'Action',
                actionText: getText('del'),
                actionFn: (e, rowData) => {
                    this.Dialog.appear({
                        component: FormCreator,
                        componentData: {
                            id: 'delete-users',
                            appState: this.appState,
                            formDesc: getText('delete_single_user_confirmation', [rowData.username]),
                            beforeFormSendingFn: () => {
                                this.Dialog.lock();
                            },
                            afterFormSentFn: () => {
                                this.usersTable.removeSelectedByTableIndex(rowData._tableIndex);
                                this.Dialog.disappear();
                                this._updateTable();
                            },
                            addToMessage: {
                                users: [rowData.id],
                            },
                            onErrorsFn: (ex, res) => {
                                this.Dialog.unlock();
                                this._updateTable();
                                if(res && res.status === 401) this.Router.changeRoute('/');
                            },
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
                        title: getText('delete_user') + ': ' + rowData.username,
                    });
                },                
            },
        ];
        return structure;
    }

    _updateTable = async () => {
        await this._loadUsers();
        this.usersTable.updateTable(this.users);
    }

    _listUsernames = (selected) => {
        let names = '';
        for(let i=0; i<selected.length; i++) {
            if(i !== 0) names += ', ';
            names += selected[i].username;
        }
        return names;
    }
}

export default UsersList;