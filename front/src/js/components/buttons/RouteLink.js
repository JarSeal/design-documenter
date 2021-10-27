class RouteLink {
    constructor(data, Router) {
        this.data = data;
        this.Router = Router;
        this.elem = document.getElementById(data.id);
        this.createButton();
    }

    createButton() {
        if(this.data.class) this.elem.classList.add(this.data.class);
        if(this.data.text) this.elem.innerHTML = this.data.text;
        this._initListener();
    }

    _initListener() {
        this.elem.addEventListener("click", this.click);
    }

    click = (e) => {
        e.preventDefault();
        if(!this.data.link) return;
        this.Router.changeRoute(this.data);
    }

    discard(fn) {
        this.elem.removeEventListener("click", this.click);
    }
}

export default RouteLink;