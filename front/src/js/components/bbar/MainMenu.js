import Component from '../../Component';

class MainMenu extends Component {
    constructor(data) {
        super(data);
    }

    init(data) {
        this.elem.innerHTML = 'B';
        this.addListener({
            id: 'new-listener',
            type: 'click',
            target: this.elem,
            fn: () => {console.log('CLACK');}
        });
        setTimeout(() => {
            this.removeListener('new-listener');
        }, 3000);
    }
}

export default MainMenu;