import axios from "axios";
import { getAdminRights } from "../../helpers/storage";
import { Component, Logger } from "../../LIGHTER";
import { _CONFIG } from "../../_CONFIG";
import TabSystem from "../buttons/TabSystem";

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
        this.template = `
        <div class="settings-page">
            Loading..
        </div>`;
        this._loadUsers();
    }

    _loadUsers = async () => {
        const url = _CONFIG.apiBaseUrl + '/api/users';
        try {
            const response = await axios.get(url, { withCredentials: true });
            const users = response.data;
            console.log('users', users);
        }
        catch(exception) {
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
        }
    }
}

export default Settings;