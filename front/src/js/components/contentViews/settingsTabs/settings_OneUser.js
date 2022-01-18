import { Component, Logger } from "../../../LIGHTER";
import axios from "axios";
import { getText } from "../../../helpers/lang";
import { _CONFIG } from "../../../_CONFIG";
import FormCreator from "../../forms/FormCreator";
import Spinner from "../../widgets/Spinner";

class OneUser extends Component {
    constructor(data) {
        super(data);
        this.template = '<div class="one-user">' +
            `<h2>${getText('user')}:</h2>` +
        '</div>';
        this.userId;
        this.userData;
        this.Dialog = this.Router.commonData.appState.state.Dialog;
        this.appState = this.Router.commonData.appState;
        this.spinner = this.addChild(new Spinner({ id: 'user-loader-indicator' }));
    }

    init = () => {
        this.userId = this.Router.getRouteParams().user;
        this._loadUserData();
    }

    paint = () => {
        if(this.userData) {
            
        } else {
            this.spinner.draw({ show: true });
        }
    }

    _loadUserData = async () => {
        this.usersData = null;
        const url = _CONFIG.apiBaseUrl + '/api/users' + '/' + this.userId;
        try {
            const response = await axios.get(url, { withCredentials: true });
            this.userData = response.data;
            console.log('RECEIVED DATA', this.userData);
            this.spinner.showSpinner(false);
            setTimeout(() => {
                this.rePaint();
            }, 400);
        }
        catch(exception) {
            const logger = new Logger('Get users: *****');
            logger.error('Could not get users data', exception);
            throw new Error('Call stack');
        }
    }
}

export default OneUser;