import axios from 'axios';
import { Component } from '../../LIGHTER';
import { _CONFIG } from '../../_CONFIG';

class Logout extends Component {
    constructor(data) {
        // Technically not a view, but it is a route
        super(data);
        this.appState = data.appState;
    }

    init = (data) => {
        this.logOut(data.appState);
    }

    logOut = async (appState) => {
        console.log('appState', appState);
        appState.set('user.loggedIn', false);
        appState.set('user.username', null);
        
        let url = _CONFIG.apiBaseUrl + '/api/login/access';
        let payload = { from: 'logout' };
        await axios.post(url, payload, { withCredentials: true });

        const browserId = this.appState.get('browserId');
        url = _CONFIG.apiBaseUrl + '/api/login/access';
        payload = { from: 'checklogin', browserId };
        await axios.post(url, payload, { withCredentials: true });

        this.Router.changeRoute('/login');
    }
}

export default Logout;