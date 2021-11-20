import axios from 'axios';
import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';
import Button from '../buttons/Button';
import { _CONFIG } from '../../_CONFIG';

class MainMenu extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.homeButton = this.addChild(new RouteLink({
            id: 'home-button',
            link: '/',
            text: 'H',
        }));
        this.newuserButton = this.addChild(new RouteLink({
            id: 'new-user-button',
            link: '/newuser',
            text: 'R',
        }));
        this.settingsButton = this.addChild(new RouteLink({
            id: 'settings-button',
            link: '/settings',
            text: 'S',
        }));
        this.logoutButton = this.addChild(new Button({
            id: 'logout-button',
            click: this.logOut,
            text: 'L',
        }));
    }

    paint = () => {
        this.homeButton.draw();
        if(this.appState.get('user.loggedIn')) {
            this.settingsButton.draw();
            this.logoutButton.draw();
        } else {
            this.newuserButton.draw();
        }
    }

    logOut = async (e) => {
        e.preventDefault();
        this.appState.set('user.username', null);
        this.appState.set('user.loggedIn', false);

        const url = _CONFIG.apiBaseUrl + '/api/login/access';
        const payload = { from: 'logout' };
        const response = await axios.post(url, payload, { withCredentials: true });
        
        this.Router.changeRoute('/login');
    }
}

export default MainMenu;