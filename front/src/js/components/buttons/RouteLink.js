class RouteLink {
    constructor(data) {
        this.data = data;
        this.listener;
        this._initListener();
    }

    _initListener() {
        // document.getElementById(this.data.id).addEventListener("click", this.click);
    }

    click = (e) => {
        e.preventDefault();
        console.log('CLICK');
    }

    html() {
        return `<button id="${this.data.id}">${this.data.text}</button>`;
    }
}

export default RouteLink;