import bbar from './bbar.html';

class Bbar {
    constructor(appState, parent) {
        parent.innerHTML += bbar;
    }
}

export default Bbar;