import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import Table from "../../widgets/Table";
import ConfirmationDialog from "../../widgets/dialogs/dialog_Confirmation";

class UsersList extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = null;
        this._loadUsers();
        this.Dialog = this.Router.commonData.appState.state.Dialog;
    }

    paint = () => {
        if(this.users) {
            this.addChild(new Table({
                id: 'users-table',
                tableData: this.users,
                fullWidth: true,
                showStats: true,
                selectable: true,
                showRowNumbers: true,
                filterHotkey: 'f',
                filter: true,
                tableStructure: this._getTableStructure(),
            })).draw();

            this.addChild(new Table({
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
            })).draw();
        }
    }

    _loadUsers = async () => {
        this.users = null;
        const url = _CONFIG.apiBaseUrl + '/api/users';
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.users = response.data;
        }
        catch(exception) {
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
        }
        this.rePaint();
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
                    console.log('HERE DELETE', rowData);
                    this.Dialog.appear({
                        component: new ConfirmationDialog({
                            id: 'del-one-user-dialog',
                            Dialog: this.Dialog,
                            message: getText('delete_single_user_confirmation', [rowData.username]),
                            confirmButtonText: getText('delete'),
                            confirmSpinner: true,
                            confirmButtonFn: () => {
                                // 1. Lock the Dialog functionality (cannot be closed) and show spinner
                                this.Dialog.lock();
                                // 2. Send the delete request to server
                                // 2.a Get error response from server and show it in the dialog
                                // 2.b Get success response from server, close dialog, and update users table
                                setTimeout(() => {
                                    this.Dialog.disappear();
                                    this.discard(true);
                                    this.reDrawSelf();
                                }, 3000);
                            },
                        }),
                        // component: new Component({
                        //     id: 'confirm-single-user-del',
                        //     template: `<p>${getText('delete_single_user_confirmation', [rowData.username])}</p>`,
                        // }),
                        title: getText('delete_user') + ':',
                    });
                },
                actionText: 'Del',
            },
        ];
        return structure;
    }
}

export default UsersList;