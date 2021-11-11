import { Component } from "../../../LIGHTER";
import './UniverseItem.scss';

// Attributes for data:
// - item = data to show
// - index = list item array index number
class UniverseItem extends Component {
    constructor(data) {
        super(data);
        data.class = 'universe-item';
        this.item = data.item;
        this.title = this.addChild(new Component({
            id: this.id+'-title',
            tag: 'h3',
            text: data.item.title,
        }));
    }

    paint = () => {
        this.title.draw();
    }
}

export default UniverseItem;