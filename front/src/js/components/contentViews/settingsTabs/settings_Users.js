import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import Table from "../../widgets/Table";
import ConfirmationDialog from "../../widgets/dialogs/dialog_Confirmation";
import FormCreator from "../../forms/FormCreator";

class UsersList extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = [];
        this.Dialog = this.Router.commonData.appState.state.Dialog;
        this.appState = this.Router.commonData.appState;
        this.usersTable = this.addChild(new Table({
            id: 'userssa-table',
            fullWidth: true,
            tableData: this.users,
            showStats: true,
            selectable: true,
            showRowNumbers: true,
            filterHotkey: 'f',
            filter: true,
            tableStructure: this._getTableStructure(),
        }));
        this.usersTable2 = this.addChild(new Table({
            id: 'users-table2',
            tableData: this.users,
            fullWidth: true,
            showStats: true,
            tools: [
                {
                    id: 'delete',
                    text: 'Delete',
                    clickFn: (e, selected) => {
                        console.log('Delete', e, selected);
                    },
                },
                {
                    id: 'edit',
                    text: 'Edit',
                    clickFn: (e, selected) => {
                        console.log('Edit', e, selected);
                    },
                },
            ],
            rowClickFn: (e, rowData) => {
                console.log('THIS ROW', rowData, e);
            },
            showGroupSize: 3,
            showRowNumbers: true,
            filter: true,
            tableStructure: this._getTableStructure(),
        }));
        this._loadUsers(true);
    }

    paint = () => {
        if(this.users.length) {
            this.usersTable.draw({ tableData: this.users });
            this.usersTable2.draw({ tableData: this.users });
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
            console.log('DELETED', response);
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
                heading: 'Edit',
                type: 'Action',
                actionFn: (e, rowData) => { console.log('TODO', rowData.username); },
            },
            {
                key: 'deleteUser',
                heading: 'Delete',
                type: 'Action',
                actionFn: (e, rowData) => {
                    this.Dialog.appear({
                        component: new FormCreator({
                            id: 'delete-users',
                            appState: this.appState,
                            formDesc: getText('delete_single_user_confirmation', [rowData.username]),
                            beforeFormSendingFn: () => {
                                this.Dialog.lock();
                            },
                            afterFormSentFn: () => {
                                this.Dialog.disappear();
                                this._updateTable();
                            },
                            addToMessage: {
                                users: [rowData.id],
                            },
                            onErrorsFn: (ex, res) => {
                                this.Dialog.unlock();
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
                        }),
                        title: getText('delete_user') + ': ' + rowData.username,
                    });
                },
                actionText: 'Del',
            },
        ];
        return structure;
    }

    _updateTable = async () => {
        await this._loadUsers();
        this.usersTable.updateTable(this.users);
        this.usersTable2.updateTable(this.users);
    }
}

export default UsersList;