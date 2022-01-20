import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';
import { getText } from "../../helpers/lang";

class FourOFour extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = '<div>' +
            `<h2>${data.title || 404}</h2>` +
        '</div>';
        this.params = {};

        this.message = this.addChild({ id: '404-message', tag: 'p' });
        this.button = this.addChild(new RouteLink({
            id: 'back-to-root',
            link: '/',
            text: getText('back_to_start'),
        }));
    }

    paint = () => {
        let text;
        if(this.data.bodyText) {
            text = this.data.bodyText;
        } else if(this.Router.curRouteData.params) {
            this.params = this.Router.curRouteData.params;
            if(this.params.type === 'universe') {
                text = getText('404_universe', [this.decodeUri(this.params.data)]);
            } else {
                text = getText('404_default_message');
            }
        } else {
            this.params = {};
            text = getText('404_default_message');
        }

        this.message.draw({ text });
        this.button.draw();
    }

    decodeUri(uri) {
        try {
            return decodeURI(uri);
        } catch (e) {
            this.logger.error('Malformed URI.', e);
            return '-';
        }
    }
}

export default FourOFour;