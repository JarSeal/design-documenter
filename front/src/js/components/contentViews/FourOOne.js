import { getText } from '../../helpers/lang';
import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';

class FourOOne extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = '<div>' +
            `<h2>${data.title || 401}</h2>` +
            `<p>${getText('unauthorised')}</p>` +
        '</div>';

        this.button = this.addChild(new RouteLink({
            id: 'back-to-root',
            link: '/',
            text: getText('back_to_start'),
        }));
    }

    paint = () => {
        this.button.draw();
    }
}

export default FourOOne;