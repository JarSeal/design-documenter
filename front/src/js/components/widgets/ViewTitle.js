import { Component } from "../../LIGHTER";
import Spinner from "./Spinner";

class ViewTitle extends Component {
    constructor(data) {
        super(data);
        this.template = `<h2></h2>`;
        this.spinner = this.addChild(new Spinner({
            id: this.id + '-spinner',
        }));
        this.spinnerFadeTime = this.spinner.fadeTime;
    }

    paint = (data) => {
        this.spinner.draw({ show: data.spinner });
    }

    showSpinner = (show) => {
        this.spinner.showSpinner(show);
    }

    updateHeading = (text) => {
        this.data.text = text;
        this.elem.innerText = text;
    }
}

export default ViewTitle;