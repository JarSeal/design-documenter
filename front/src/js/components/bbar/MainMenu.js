class MainMenu {
    constructor(data, appState) {
        this.data = data;
        this.Router = appState.get('Router');
        this.elem = document.getElementById(data.id);
    }

    createMenu() {
        
    }
}

export default MainMenu;