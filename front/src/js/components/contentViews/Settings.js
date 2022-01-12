import { getAdminRights } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import TabSystem from "../buttons/TabSystem";
import FourOOne from "./FourOOne";
import UsersList from "./settingsTabs/settings_Users";

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
            if(currentTab) {
                this.addChild(new currentTab.component({ id: 'view-' + currentTab.id })).draw();
            } else {
                this.addChild(new FourOOne({id: 'four-o-one-tab', title: '401'})).draw();
            }
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
            adminUseRights: 'read-users',
            show: this.adminRights.useRights.includes('read-users'),
            component: UsersList,
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