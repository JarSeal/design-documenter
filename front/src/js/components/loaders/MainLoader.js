import './MainLoader.scss';

class MainLoader {
    constructor(parent) {
        this.id = 'main-loader';
        const html = `<div id="${this.id}">Loading..</div>`;
        parent.innerHTML = html;
        this.elem = document.getElementById(this.id);
    }

    toggle(show) {
        this.elem = document.getElementById(this.id);
        if(show) {
            this.elem.classList.add('show');
        } else {
            this.elem.classList.remove('show');
        }
    }
}

export default MainLoader;