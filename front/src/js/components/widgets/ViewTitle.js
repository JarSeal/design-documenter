import { Component } from "../../LIGHTER";
import Spinner from "./Spinner";
import './ViewTitle.scss';

// Attributes:
// - heading: String
// - spinner: Boolean
class ViewTitle extends Component {
    constructor(data) {
        super(data);
        this.template = `<div class="view-title"><h2 id="${this.id+'-heading'}">${data.heading}</h2></div>`;
        this.spinner = this.addChild(new Spinner({
            id: this.id + '-spinner',
            attach: this.id+'-heading',
        }));
        this.spinnerFadeTime = this.spinner.fadeTime;
    }

    paint = (data) => {
        this.spinner.draw({ show: data.spinner });
    }

    showSpinner = (show) => {
        this.spinner.showSpinner(show);
    }

    updateHeading = (heading) => {
        this.data.heading = heading;
        const headingElem = this.elem.querySelector('#'+this.id+'-heading');
        if(headingElem) headingElem.innerText = heading;
    }
}

export default ViewTitle;