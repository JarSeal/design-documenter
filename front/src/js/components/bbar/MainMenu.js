import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';
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
        this.logoutButton = this.addChild(new RouteLink({
            id: 'logout-button',
            link: '/logout',
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
}

export default MainMenu;