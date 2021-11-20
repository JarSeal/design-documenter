import axios from 'axios';
import { Component } from '../../LIGHTER';
import { _CONFIG } from '../../_CONFIG';

class Logout extends Component {
    constructor(data) {
        super(data);
    }

    paint = (data) => {
        this.logOut(data.appState);
    }

    logOut = async (appState) => {
        appState.set('user.loggedIn', false);
        appState.set('user.username', null);
        
        const url = _CONFIG.apiBaseUrl + '/api/login/access';
        const payload = { from: 'logout' };
        const response = await axios.post(url, payload, { withCredentials: true });

        this.Router.changeRoute('/login');
    }
}

export default Logout;