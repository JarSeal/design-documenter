import { getAdminRights } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import TabSystem from "../buttons/TabSystem";

class Settings extends Component {
    constructor(data) {
        super(data);
        const defaultTab = 'my-ui';
        this.curTab = defaultTab;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.adminRights = {};
        this.tabSystem;
    }

    init = async () => {
        const params = this.Router.curRouteData.params;
        if(params && params.tab === 'default') {
            this.discard(true);
            this.Router.changeRoute('/settings/' + this.curTab);
            return;
        }

        this.adminRights = await getAdminRights();
        console.log('End', this.adminRights);

        const tabs = this._defineTabs();
        this.tabSystem = this.addChild(new TabSystem({
            id: 'settings-tabs',
            tabs,
        }));

        this.rePaint();
    }

    paint = () => {
        if(this.tabSystem) this.tabSystem.draw();
    }

    _defineTabs = () => {
        const tabs = [];
        const define = [{ // Define them here
            id: 'my-ui',
            label: 'My UI',
        }, {
            id: 'admin-users',
            label: '[Admin] Users',
        }];

        for(let i=0; i<define.length; i++) {
            tabs.push({
                label: define[i].label,
                id: define[i].id,
                routeLink: '/settings/' + define[i].id,
                setLabelInTitle: true,
            });
        }

        return tabs;
    }
}

export default Settings;