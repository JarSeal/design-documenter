class Landing {
    constructor() {
        this.appState;
    }

    drawContent(appState, parent) {
        this.appState = appState;
        parent.innerHTML = `<div class="content">landing</div>`;
    }
}

export default Landing;