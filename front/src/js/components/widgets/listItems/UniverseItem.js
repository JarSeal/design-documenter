import { Component } from "../../../LIGHTER";

// Attributes for data:
// - item = data to show
// - index = list item array index number
class UniverseItem extends Component {
    constructor(data) {
        super(data);
        data.class = 'list-item';
        this.template = `<button></button>`;
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