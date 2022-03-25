import { getText } from '../../helpers/lang';
import { Component } from '../../LIGHTER';
import ViewTitle from '../widgets/ViewTitle';

class VerifyWToken extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
            spinner: true,
        }));
    }

    init = () => {
        this.viewTitle.showSpinner(true);
        const token = this.Router.getRouteParams().token;

        console.log('TOKEN', token);
    }

    paint = () => {
        this.viewTitle.draw();
    }
}

export default VerifyWToken;