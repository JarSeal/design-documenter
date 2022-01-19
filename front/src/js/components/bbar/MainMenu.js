import Component from '../../LIGHTER/Component';
import RouteLink from '../buttons/RouteLink';
import { _CONFIG } from '../../_CONFIG';
import Button from '../buttons/Button';
import './MainMenu.scss';

class MainMenu extends Component {
    constructor(data) {
        super(data);
        this.appState = data.appState;
        this.switchTime = 300; // milliseconds
        this.template = '<div class="main-menu">' +
            '<div id="nav-menu"></div>' +
            `<div id="tool-menu" class="show-tool-menu" style="transition-duration:${this.switchTime}ms"></div>` +
            '<div id="sticky-menu"></div>' +
        '</div>';

        this.homeButton = this.addChild(new RouteLink({
            id: 'home-button',
            link: '/',
            attach: 'nav-menu',
            text: 'Home',
        }));
        this.newuserButton = this.addChild(new RouteLink({
            id: 'new-user-button',
            link: '/newuser',
            attach: 'sticky-menu',
            text: '+New',
        }));
        this.settingsButton = this.addChild(new RouteLink({
            id: 'settings-button',
            link: '/settings',
            attach: 'sticky-menu',
            text: 'Settings',
        }));
        this.logoutButton = this.addChild(new RouteLink({
            id: 'logout-button',
            link: '/logout',
            attach: 'sticky-menu',
            text: 'Logout',
        }));

        this.menuState = {
            backButton: false,
            toolsMenu: [],
            newMenuState: [],
        };

        this.appState.set('updateMainMenu', this.updateMainMenu);

    }

    paint = () => {
        this.homeButton.draw();
        this._hideTools();
        this._drawStickyMenu();
    }

    _hideTools = () => {
        this._drawOldTools();
        const navMenuElem = this.elem.querySelector('#tool-menu');
        setTimeout(() => {
            navMenuElem.classList.remove('show-tool-menu');
        }, 20);
        setTimeout(() => {
            const tools = this.menuState.toolsMenu;
            for(let i=0; i<tools.length; i++) {
                this.discardChild(tools[i].id);
            }
            let newTools = [];
            if(this.menuState.newMenuState && this.menuState.newMenuState.tools) {
                newTools = [...this.menuState.newMenuState.tools];
                this.menuState.newMenuState.tools = [];
            }
            this._drawTools(newTools);
        }, this.switchTime + 100);
    }

    _drawOldTools = () => {
        for(let i=0; i<this.menuState.toolsMenu.length; i++) {
            const id = this.menuState.toolsMenu[i].id;
            if(this.children[id]) this.children[id].draw();
        }
    }

    _drawTools = (newTools) => {
        for(let i=0; i<newTools.length; i++) {
            const tool = newTools[i];
            tool.attach = 'tool-menu';
            const comp = this.addChild(new Button(tool));
            this.menuState.toolsMenu.push(comp);
            comp.draw();
        }
        const navMenuElem = this.elem.querySelector('#tool-menu');
        navMenuElem.classList.add('show-tool-menu');
    }

    _drawStickyMenu = () => {
        if(this.appState.get('user.loggedIn')) {
            this.settingsButton.draw();
            this.logoutButton.draw();
        } else {
            this.newuserButton.draw();
        }
    }

    updateMainMenu = (newMenuState) => {
        this.menuState.newMenuState = newMenuState;
    }
}

export default MainMenu;