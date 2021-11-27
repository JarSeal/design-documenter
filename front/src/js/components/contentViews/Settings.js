import axios from "axios";
import { getText } from "../../helpers/lang";
import { getAdminRights } from "../../helpers/storage";
import { Component, Logger } from "../../LIGHTER";
import { _CONFIG } from "../../_CONFIG";
import TabSystem from "../buttons/TabSystem";
import Table from "../widgets/Table";

class Settings extends Component {
    constructor(data) {
        super(data);
        const defaultTab = 'my-ui';
        this.curTab = defaultTab;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.adminRights = {};
        this.tabSystem;
        this.tabs = [];
    }

    init = async () => {
        const params = this.Router.curRouteData.params;
        if(params && params.tab === 'default') {
            this.discard(true);
            this.Router.changeRoute('/settings/' + this.curTab);
            return;
        }

        this.adminRights = await getAdminRights();

        this._defineTabs();
        this.tabSystem = this.addChild(new TabSystem({
            id: 'settings-tabs',
            tabs: this.tabs,
        }));

        this.rePaint();
    }

    paint = () => {
        if(this.tabSystem) {
            this.tabSystem.draw();
            const currentTab = this.tabSystem.getCurrent();
            this.addChild(new currentTab.component({ id: 'view-' + currentTab.id })).draw();
        }
    }

    _defineTabs = () => {
        const define = [{ // Define tabs here
            id: 'my-ui',
            label: 'My UI', // TODO: Change into a getText lang asset
            component: Component,
        }, {
            id: 'users',
            label: 'Users', // TODO: Change into a getText lang asset
            show: this.adminRights.useRights.includes('read-users'),
            component: UsersList,
        }];

        for(let i=0; i<define.length; i++) {
            if(define[i].show === false) continue;
            this.tabs.push({
                label: define[i].label,
                id: define[i].id,
                routeLink: '/settings/' + define[i].id,
                setLabelInTitle: true,
                component: define[i].component,
            });
        }
    }
}

class UsersList extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.users = null;
        this._loadUsers();
    }

    paint = () => {
        if(this.users) {
            this.addChild(new Table({
                id: 'users-table',
                tableData: this.users,
                fullWidth: true,
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
            this.rePaint();
        }
        catch(exception) {
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
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
                unsortable: true,
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
        ];
        return structure;
    }
}

export default Settings;