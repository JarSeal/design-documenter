import { getText } from "../../helpers/lang";
import { saveUser } from "../../helpers/storage";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";
import FormCreator from "../forms/FormCreator";
import UniverseItem from "../widgets/listItems/UniverseItem";
import ListLoader from "../widgets/ListLoader";

class Landing extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.template = `<div><h2>${data.title}</h2></div>`;
        this.mainScreenInitiated = false;
        this.mainScreenCompos = [];
    }

    initMainScreen = () => {
        if(this.mainScreenInitiated) return;
        this.mainScreenCompos.push(
            this.addChild(new Component({ id: 'universe-wrapper', class: 'list-wrapper' }))
        );
        this.mainScreenCompos.push(this.addChild(new Button({
            id: 'add-uni-button',
            attach: 'universe-wrapper',
            attributes: { title: 'Add a Universe' },
            text: '+',
            class: ['list-add-button', 'list-item'],
            click: (e) => {
                this.appState.get('Dialog').appear({
                    component: new FormCreator({
                        id: 'new-universe-form',
                        afterFormSentFn: () => {
                            this.appState.get('Dialog').disappear();
                            this.universesList.updateList();
                        },
                    }),
                    title: getText('create_new_universe'),
                });
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
}

export default Landing;