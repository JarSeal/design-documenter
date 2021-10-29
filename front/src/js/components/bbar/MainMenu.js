import Component from '../../lighter/Component';

class MainMenu extends Component {
    constructor(data) {
        super(data);
    }

    paint = () => {
        this.elem.innerHTML = 'B';
    }
}

export default MainMenu;