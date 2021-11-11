import { Component } from "../../LIGHTER";

// Attributes for data:
// - api = API to call when the list is loaded
class ListLoader extends Component {
    constructor(data) {
        super(data);
        this.api = data.api;
        
    }
}

export default ListLoader;