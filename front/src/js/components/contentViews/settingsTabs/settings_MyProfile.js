import axios from 'axios';
import { getText } from '../../../helpers/lang';
import { Component, Logger } from '../../../LIGHTER';
import { _CONFIG } from '../../../_CONFIG';
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
    }

    init = () => {
        this._loadMyData();
    }

    paint = () => {
        this.viewTitle.draw();
    }

    _loadMyData = async () => {

        // Load form data
        const url = _CONFIG.apiBaseUrl + '/api/forms/user-settings-form';
        const result = await axios.get(url, { withCredentials: true });
        if(result.data) {
            console.log('DATA', result.data);
        } else {
            Logger.log('Could not retrieve user settings (My Settings) form data.');
            return;
        }

        this.viewTitle.showSpinner(false);
    }
}

export default MyProfile;