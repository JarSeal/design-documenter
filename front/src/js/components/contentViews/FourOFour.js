import Component from '../../Component';
import RouteLink from '../buttons/RouteLink';

class FourOFour extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;

        this.button = this.addChild(new RouteLink({
            id: 'back-to-root',
            link: '/',
            appState: data.appState,
            text: 'Try again from here..',
        }));
    }

    init() {
        this.button.draw();
    }
}

export default FourOFour;