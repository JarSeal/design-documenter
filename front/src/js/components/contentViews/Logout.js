import axios from 'axios';
import { Component } from '../../LIGHTER';
import { _CONFIG } from '../../_CONFIG';

class Logout extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
    }

    paint = (data) => {
        this.logOut(data.appState);
    }

    logOut = async (appState) => {
        appState.set('user.loggedIn', false);
        appState.set('user.username', null);
        
        let url = _CONFIG.apiBaseUrl + '/api/login/access';
        let payload = { from: 'logout' };
        await axios.post(url, payload, { withCredentials: true });

        const browserId = this.appState.get('browserId');
        const randomId = this.appState.get('randomId');
        url = _CONFIG.apiBaseUrl + '/api/login/access';
        payload = { from: 'checklogin', browserId, randomId };
        await axios.post(url, payload, { withCredentials: true });

        this.Router.changeRoute('/login');
    }
}

export default Logout;