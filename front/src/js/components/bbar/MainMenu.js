import Component from '../../Component';

class MainMenu extends Component {
    constructor(id, data) {
        super(id, data);
    }

    init(data) {
        this.elem.innerHTML = 'B';
        
    }
}

export default MainMenu;