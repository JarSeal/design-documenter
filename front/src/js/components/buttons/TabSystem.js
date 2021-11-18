import { Component } from "../../LIGHTER";

// Attributes:
// - tabs = Array[Object]
//     -> tab Object {
//          label: String [required],
//          id: String,
//          routeLink: String,
//          clickFn: Function,
//          current: Boolean,
//          class: Array[String] or String,
//          disabled: Boolean,
//        }
class TabSystem extends Component {
    constructor(data) {
        super(data);
        this.tabs = data.tabs;
        this.template = `<div class="tab-system"></div>`;

        // Create tabs buttons
        this.buttons = [];
        for(let i=0; i<data.tabs.length; i++) {
            let id, tabClass, attributes;
            if(data.tabs[i].id) {
                id = data.tabs[i].id;
            } else {
                id = this.id + '-tab-' + i;
            }
            if(data.tabs[i].class) {
                tabClass = data.tabs[i].class;
                if(typeof tabClass === 'string' || tabClass instanceof String) {
                    if(data.tabs[i].current) tabClass += ' current';
                } else {
                    tabClass.push('current');
                }
            } else {
                if(data.tabs[i].current) tabClass = 'current';
            }
            if(data.tabs[i].disabled) attributes = { disabled: '' };
            this.buttons.push(this.addChild(new Component({
                id,
                class: tabClass,
                text: data.tabs[i].label,
                tag: 'button',
                attributes,
            })));
        }
    }

    addClicker = (i) => {
        if(this.tabs[i].clickFn) {
            this.buttons[i].addListener({
                type: 'click',
                fn: (e) => {
                    this.tabs[i].clickFn(e, this.tabs[i].routeLink ? () => {
                        this.Router.changeRoute(this.tabs[i].routeLink, true);
                    } : null);
                },
            });
        } else if(this.tabs[i].routeLink) {
            this.buttons[i].addListener({
                type: 'click',
                fn: () => {
                    this.Router.changeRoute(this.tabs[i].routeLink, true);
                },
            });
        }
    }

    paint = () => {
        for(let i=0; i<this.buttons.length; i++) {
            this.buttons[i].draw();
            this.addClicker(i);
        }
    }
}

export default TabSystem;