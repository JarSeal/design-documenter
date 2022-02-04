import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
import { createDate } from '../../../helpers/date';
import ReadApi from '../../forms/ReadApi';
import ViewTitle from '../../widgets/ViewTitle';

class MyProfile extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="settings-tab-view"></div>';
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-sub-view-title',
            heading: getText('my_profile'),
            tag: 'h3',
            spinner: true,
        }));
        this.data;
        this.readApi = new ReadApi({ url: '/api/users/own/profile' });
        this.dataComps = [];
    }

    init = () => {
        this._loadMyData();
    }

    paint = () => {
        this.viewTitle.draw();
    }

    _loadMyData = async () => {

        this.data = await this.readApi.getData();
        if(this.data.error) {
            this.viewTitle.showSpinner(false);
            this.addChild({
                id: 'error-getting-my-profile',
                template: `<div class="error-text">${getText('could_not_get_data')}</div>`,
            }).draw();
        }

        this.rePaint();
        this.viewTitle.showSpinner(false);
        this._createElements();
    }

    _createElements = () => {
        const contentDefinition = [
            { id: 'username', tag: 'h1', label: getText('username') },
            { id: 'name', label: getText('name') },
            { id: 'email', label: getText('email') },
        ];
        for(let i=0; i<contentDefinition.length; i++) {
            const item = contentDefinition[i];
            let value;
            let tag = 'div';
            if(item.tag) tag = item.tag;
            this.discardChild('user-data-' + item.id);
            
            if(this.data[item.id] === undefined) {
                continue;
            } else if(item.id === 'created') {
                value = createDate(this.data[item.id].date);
            } else if(item.id === 'edited' && this.data[item.id][0]) {
                const lastIndex = this.data[item.id].length - 1;
                value = createDate(this.data[item.id][lastIndex].date);
            } else if(item.id === 'userLevel') {
                if(item.id === 'userLevel') value = getText('user_level_' + this.data[item.id]);
            } else {
                value = this.data[item.id];
            }
            if(!value.length) value = '&nbsp;';
            const comp = this.addChild({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label}</span>` +
                    `<${tag} class="user-data-item__value">${value}</${tag}>` +
                '</div>',
            });
            this.dataComps.push(comp);
            comp.draw();
        }
    }
}

export default MyProfile;