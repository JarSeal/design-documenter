import Component from '../../lighter/Component';
import RouteLink from '../buttons/RouteLink';
import Button from '../buttons/Button';

class MainMenu extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.homeButton = this.addChild(new RouteLink({
            id: 'home-button',
            link: '/',
            text: 'H',
        }));
        this.brokenButton = this.addChild(new RouteLink({
            id: 'broken-button',
            link: '/somewhere',
            text: 'B',
        }));
        this.logoutButton = this.addChild(new Button({
            id: 'logout-button',
            click: this.click,
            text: 'L',
        }));
    }

    paint = () => {
        this.homeButton.draw();
        this.brokenButton.draw();
        this.logoutButton.draw();
    }

    click = (e) => {
        e.preventDefault();
        this.appState.set('user.loggedIn', false);
    }
}

export default MainMenu;