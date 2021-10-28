import Component from '../../Component';

class MainMenu extends Component {
    constructor(data) {
        super(data);
    }

    init(data) {
        this.elem.innerHTML = 'B';
    }
}

export default MainMenu;