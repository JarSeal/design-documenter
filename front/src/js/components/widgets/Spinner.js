import { Component } from "../../LIGHTER";

// Attributes for data:
// - show = show the spinner or not [boolean]
// - fadeTime = spinner in and out fade time in milliseconds [integer]
class Spinner extends Component {
    constructor(data) {
        super(data);
        this.template = `<div class="spinner-icon"></div>`;
        this.spinnerAnimTimer;
        this.fadeTime = (data.fadeTime || 400) + 10;
        data.style = { transitionDuration: this.fadeTime + 'ms' };
    }

    showSpinner = (show) => {
        const elem = this.elem;
        if(show) {
            elem.style.display = 'block';
            clearTimeout(this.spinnerAnimTimer);
            this.spinnerAnimTimer = setTimeout(() => {
                elem.classList.add('show-spinner');
            }, 10);
        } else {
            elem.style.display = 'block';
            elem.classList.add('show-spinner');
            setTimeout(() => {
                elem.classList.remove('show-spinner');
                clearTimeout(this.spinnerAnimTimer);
                this.spinnerAnimTimer = setTimeout(() => {
                    elem.style.display = 'none';
                }, this.fadeTime);
            }, this.fadeTime / 4);
        }
    }
}

export default Spinner;