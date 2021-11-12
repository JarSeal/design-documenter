import axios from 'axios';
import { Component } from "../../LIGHTER";
import { parsers } from "../../shared";
import { _CONFIG } from '../../_CONFIG';
import Spinner from "../widgets/Spinner";

class NewUser extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.universeId;
        this.loadingData = false;
        this.template = `<div>
            <h2 id="${this.id+'-main-title'}"></h2>
        </div>`;
        this.mainSpinner = this.addChild(new Spinner({
            id: 'load-universe-spinner',
            show: true,
        }));
    }

    init = () => {
        if(this.Router.curRouteData.params
            && this.Router.curRouteData.params.universeId
            && parsers.validateSimpleId(this.Router.curRouteData.params.universeId)
        ) {
            this.universeId = this.Router.curRouteData.params.universeId;
            this.getData();
        } else {
            this.Router.changeRoute('/404');
            return;
        }
    }

    paint = () => {
        if(this.mainSpinner) this.mainSpinner.draw();
    }

    getData = async () => {
        this.loadingData = true;
        const url = _CONFIG.apiBaseUrl + '/universes/' + this.universeId;
        const response = await axios.get(url);
        const uniData = response.data;
        
        const uniTitleElem = this.elem.querySelector('#'+this.id+'-main-title');
        uniTitleElem.innerText = uniData.title;

        this.loadingData = false;
        this.mainSpinner.showSpinner(false);
        setTimeout(() => {
            this.mainSpinner.discard(true);
            this.mainSpinner = null;
            this.rePaint();
        }, this.mainSpinner.fadeTime + this.mainSpinner.fadeTime / 4);
    }
}

export default NewUser;