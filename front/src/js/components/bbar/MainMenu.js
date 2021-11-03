import Component from '../../LIGHTER/Component';
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
        this.newuserButton = this.addChild(new RouteLink({
            id: 'new-user-button',
            link: '/newuser',
            text: 'R',
        }));
        this.logoutButton = this.addChild(new Button({
            id: 'logout-button',
            click: this.click,
            text: 'L',
        }));
    }

    paint = () => {
        this.homeButton.draw();
        this.newuserButton.draw();
        if(this.appState.get('user.loggedIn')) {
            this.logoutButton.draw();
        }
    }

    click = (e) => {
        e.preventDefault();
        this.appState.set('user.loggedIn', false);
    }
}

export default MainMenu;