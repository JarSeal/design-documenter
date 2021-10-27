class FourOFour {
    constructor() {
        this.appState;
    }

    drawContent(appState, parent) {
        this.appState = appState;
        parent.innerHTML = `<div class="content">404</div>`;
    }
}

export default FourOFour;