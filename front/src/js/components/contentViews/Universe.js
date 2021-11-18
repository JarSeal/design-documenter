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
            if(this.mainSpinner) this.mainSpinner.draw({ show: true });
            this.universeId = this.Router.curRouteData.params.universeId;
            this.getData();
        } else {
            const path404 = '/404/universe/' + (this.Router.curRouteData.params
                ? this.Router.curRouteData.params.universeId
                : '');
            this.Router.changeRoute(path404);
            return;
        }
    }

    paint = () => {
        if(this.mainSpinner) this.mainSpinner.draw({ show: true });
    }

    getData = async () => {
        this.loadingData = true;
        const path = '/api/universes/' + this.universeId;
        const response = await axios.get(_CONFIG.apiBaseUrl + path);
        const uniData = response.data;

        if(!uniData) {
            this.Router.changeRoute('/404/universe/' + this.universeId);
            return;
        }
        
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