import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";
import FormCreator from "../forms/FormCreator";
import UniverseItem from "../widgets/listItems/UniverseItem";
import ListLoader from "../widgets/ListLoader";
import ViewTitle from "../widgets/ViewTitle";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.mainScreenInitiated = false;
        this.mainScreenCompos = [];
        this.viewTitle = this.addChild(new ViewTitle({
            id: this.id+'-view-title',
            heading: data.title,
        }));
    }

    init = () => {
        this.appState.get('updateMainMenu')({
            tools: [{
                id: 'edit-user-tool',
                type: 'button',
                text: 'New',
                click: () => { this._showNewUniDialog(); }
            }]
        });
    }

    initMainScreen = () => {
        this.viewTitle.draw();
        if(this.mainScreenInitiated) return;
        this.mainScreenCompos.push(
            this.addChild({ id: 'universe-wrapper', class: 'list-wrapper' })
        );
        this.mainScreenCompos.push(this.addChild(new Button({
            id: 'add-uni-button',
            attach: 'universe-wrapper',
            attributes: { title: getText('create_new_universe') },
            text: '+',
            class: ['list-add-button', 'list-item'],
            click: (e) => {
                this._showNewUniDialog();
            },
        })));
        this.universesList = this.addChild(new ListLoader({
            id: 'universes-list',
            api: '/api/universes',
            attach: 'universe-wrapper',
            component: UniverseItem,
        }));
        this.mainScreenCompos.push(this.universesList);
    }

    paint = () => {
        this.initMainScreen();
        for(let i=0; i<this.mainScreenCompos.length; i++) {
            this.mainScreenCompos[i].draw();
        }
    }

    _showNewUniDialog = () => {
        const Dialog = this.appState.get('Dialog');
        Dialog.appear({
            component: FormCreator,
            componentData: {
                id: 'new-universe-form',
                appState: this.appState,
                afterFormSentFn: () => {
                    this.appState.get('Dialog').disappear();
                    this.universesList.updateList();
                },
                onErrorsFn: (ex, res) => {
                    if(res && res.status === 401) this.Router.changeRoute('/');
                },
                formLoadedFn: () => { this.appState.get('Dialog').onResize(); },
            },
            title: getText('create_new_universe'),
        });
    }
}

export default Landing;