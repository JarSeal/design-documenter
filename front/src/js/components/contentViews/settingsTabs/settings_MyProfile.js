// import axios from 'axios';
import { getText } from '../../../helpers/lang';
import { Component } from '../../../LIGHTER';
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
        }));
    }

    paint = () => {
        this.viewTitle.draw();
    }
}

export default MyProfile;