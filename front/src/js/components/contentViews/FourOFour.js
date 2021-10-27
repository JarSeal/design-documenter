import RouteLink from '../buttons/RouteLink';

class FourOFour {
    constructor() {
        this.appState;
        this.button;
    }

    draw(appState, parent) {
        this.appState = appState;
        this.button = new RouteLink({
            link: '/',
            id: 'back-to-root',
            text: 'Try again from here..',
        });
        parent.innerHTML = `
            <div class="content">
                <h2>404</h2>
                ${this.button.html()}
            </div>
        `;
    }

    discard() {
        this.button.discard();
    }
}

export default FourOFour;