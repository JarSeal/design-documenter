class RouteLink {
    constructor(data) {
        this.data = data;
        this.listener;
        this._initListener();
        const html = `<button id="${data.id}">${data.text}</button>`;
        const button = document.createElement('button');
        button.id = this.data.id;
        this.button = button;
    }

    _initListener() {
        // document.getElementById(this.data.id).addEventListener("click", this.click);
    }

    click = (e) => {
        e.preventDefault();
        console.log('CLICK');
    }

    html() {
        return this.button;
    }

    discard() {
        // Remove event listener
    }
}

export default RouteLink;