import './MainLoader.scss';

class MainLoader {
    constructor(parent) {
        this.id = 'main-loader';
        this.fadeTime = 200; // in milliseconds
        const html = `<div id="${this.id}">Loading..</div>`;
        parent.innerHTML = html;
        this.elem = document.getElementById(this.id);
        this.elem.style.transitionDuration = this.fadeTime + 'ms';
    }

    toggle(show) {
        this.elem = document.getElementById(this.id);
        if(show) {
            this.elem.classList.add('show');
        } else {
            this.elem.classList.remove('show');
        }
    }

    show() {
        this.toggle(true);
    }

    hide(callback) {
        this.toggle(false);
        if(callback) {
            setTimeout(() => {
                callback();
            }, this.fadeTime);
        }
    }
}

export default MainLoader;