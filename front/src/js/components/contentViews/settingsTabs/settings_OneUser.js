import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import { createDate } from "../../../helpers/date";
import FormCreator from "../../forms/FormCreator";
import Spinner from "../../widgets/Spinner";
import Button from "../../buttons/Button";
import './settings_OneUser.scss';

class OneUser extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="one-user">' +
            '<div id="back-button-holder"></div>' +
            `<h2>${getText('user')}</h2>` +
        '</div>';
        this.userId;
        this.userData;
        this.Dialog = this.Router.commonData.appState.state.Dialog;
        this.appState = this.Router.commonData.appState;
        this.spinner = this.addChild(new Spinner({ id: 'user-loader-indicator' }));
        this.userDataElems = [];
        this.backButton = this.addChild(new Button({ // TODO MOVE TO OWN COMPONENT
            id: 'back-button',
            text: 'Back',
            noRedraws: true,
            attach: 'back-button-holder',
            click: () => { history.back(); },
        }));
    }

    init = () => {
        this.userId = this.Router.getRouteParams().user;
        this._loadUserData();
    }

    paint = () => {
        this.backButton.draw();
        this.spinner.draw();
    }

    _loadUserData = async () => {
        this.usersData = null;
        this.spinner.showSpinner(true);
        const url = _CONFIG.apiBaseUrl + '/api/users' + '/' + this.userId;
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.userData = response.data;
            console.log('RECEIVED DATA', this.userData);
            this.spinner.showSpinner(false);
            this._createElements();
        }
        catch(exception) {
            this.spinner.showSpinner(false);
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
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
            this.discardChild('user-data-' + item.id);
            
            if(item.id === 'created') {
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
            this.addChild({
                id: 'user-data-' + item.id,
                template: '<div class="user-data-item">' +
                    `<span class="user-data-item__label">${item.label}</span>` +
                    `<${tag} class="user-data-item__value">${value}</${tag}>` +
                '</div>',
            }).draw();
        }
    }
}

export default OneUser;