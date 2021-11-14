import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';

class FourOOne extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;

        this.button = this.addChild(new RouteLink({
            id: 'back-to-root',
            link: '/',
            text: 'Try again from here..',
        }));
    }

    paint = () => {
        this.button.draw();
    }
}

export default FourOOne;