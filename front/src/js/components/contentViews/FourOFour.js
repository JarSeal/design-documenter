import Component from '../../lighter/Component';
import RouteLink from '../buttons/RouteLink';

class FourOFour extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;

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