import Component from '../../Component';
import RouteLink from '../buttons/RouteLink';

class FourOFour extends Component {
    constructor(data) {
        super(data);
        this.appState;
        this.button;
    }

    draw(appState, parent) {
        this.appState = appState;
        parent.innerHTML = `
            <div class="content">
                <h2>404</h2>
                <button id="back-to-root"></button>
            </div>
        `;
        this.button = new RouteLink({
            link: '/',
            id: 'back-to-root',
            text: 'Try again from here..',
        }, appState);
    }

    discard() {
        this.button.discard();
    }
}

export default FourOFour;