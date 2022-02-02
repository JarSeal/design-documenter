import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
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
        this.readApi = new ReadApi({ url: '/api/forms/user-settings-form' });
    }

    init = () => {
        this._loadMyData();
    }

    paint = () => {
        this.viewTitle.draw();
    }

    _loadMyData = async () => {

        this.data = await this.readApi.getData();

        this.rePaint();
        this.viewTitle.showSpinner(false);
    }
}

export default MyProfile;