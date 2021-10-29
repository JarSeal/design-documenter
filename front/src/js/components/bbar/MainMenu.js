import Component from '../../lighter/Component';
import RouteLink from '../buttons/RouteLink';

class MainMenu extends Component {
    constructor(data) {
        super(data);
        this.homeButton = this.addChild(new RouteLink({
            id: 'home-button',
            link: '/',
            text: 'H',
        }));
        this.loginButton = this.addChild(new RouteLink({
            id: 'login-button',
            link: '/login',
            text: 'L',
        }));
        this.brokenButton = this.addChild(new RouteLink({
            id: 'broken-button',
            link: '/somewhere',
            text: 'B',
        }));
    }

    paint = () => {
        this.homeButton.draw();
        this.loginButton.draw();
        this.brokenButton.draw();
    }
}

export default MainMenu;