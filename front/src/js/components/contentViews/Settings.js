import { getText } from "../../helpers/lang";
import { getAdminRights } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import TabSystem from "../buttons/TabSystem";
import ViewTitle from "../widgets/ViewTitle";
import FourOOne from "./FourOOne";
import AdminSettings from "./settingsTabs/settings_Admin";
import UsersList from "./settingsTabs/settings_Users";

class Settings extends Component {
    constructor(data) {
        super(data);
        const defaultTab = 'my-settings';
        this.curTab = defaultTab;
        this.template = `<div></div>`;
        this.adminRights = {};
        this.tabSystem;
        this.tabs = [];
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
        }));
    }

    init = async () => {
        const params = this.Router.curRouteData.params;
        if(params && params.tab === 'default') {
            this.Router.changeRoute('/settings/' + this.curTab, {
                forceUpdate: true,
                replaceState: true,
            });
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
        this.viewTitle.draw();
        if(this.tabSystem) {
            this.tabSystem.draw();
            const currentTab = this.tabSystem.getCurrent();
            if(currentTab) {
                this.addChild(new currentTab.component({ id: 'view-' + currentTab.id })).draw();
            } else {
                this.addChild(new FourOOne({id: 'four-o-one-tab', title: '401'})).draw();
            }
        }
    }

    _defineTabs = () => {
        const define = [{
            id: 'my-settings',
            label: getText('my_settings'),
            component: Component,
        }, {
            id: 'my-profile',
            label: getText('my_profile'),
            component: Component,
        }, {
            id: 'users',
            label: getText('users'),
            adminUseRights: 'read-users',
            show: this.adminRights.useRights.includes('read-users'),
            component: UsersList,
        }, {
            id: 'admin-settings',
            label: getText('admin_settings'),
            adminUseRights: 'read-users', // TODO change to admin settings
            show: this.adminRights.useRights.includes('read-users'), // TODO change to admin settings
            component: AdminSettings,
        }];

        for(let i=0; i<define.length; i++) {
            this.tabs.push({
                ...define[i],
                routeLink: '/settings/' + define[i].id,
                setLabelInTitle: true,
            });
        }
    }
}

export default Settings;