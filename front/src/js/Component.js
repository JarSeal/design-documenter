class Component {
    constructor(data) {
        this.data = data; // Required { id[string], parent[elem] (or parentId[string]) }
        this.id = data.id;
        this.parent;
        this.parentId;
        this.template;
        this.elem;
        this.listeners = {};
        this._validateData(data);
    }

    draw() { // Main Component drawing logic
        const data = this.data;
        if(!data.parent) {
            data.parent = document.getElementById(data.parentId);
            if(!data.parent) {
                console.error('Could not find parent element.');
                return;
            }
        }
        this.parent = data.parent;
        this.parentId = data.parentId;
        if(!this.template && data.template) this.template = data.template;
        if(!this.template) this.template = this._createDefaultTemplate(data);
        if(data.replace) {
            // Exclusive element draw to parent's innerHTML
            this.parent.innerHTML = this.template;
        } else {
            // Append element to parent's innerHTML
            this.parent.innerHTML += this.template;
        }
        this.elem = document.getElementById(data.id);
        this.init(data);
    }

    init(data) {} // To start the custom component logic (is called after draw)

    discard() {
        // TODO: Remove all possible listeners here
        
    }

    discardExtension() {} // Additional discard logic from the custom Component

    addListener(listener) {
        const { id, target, type, fn } = listener;
        if(!id || !target || !type || !fn) {
            console.error('Could not add listener, id, target, type, and/or fn missing.');
        }
        if(this.listeners[id]) this.removeListener(id);
        target.addEventListener(type, fn);
        this.listeners[id] = listener;
    }

    removeListener(id) {
        if(!id) {
            console.error('Could not remove listener, id missing.');
            return;
        }
        const { target, type, fn } = this.listeners[id];
        target.removeEventListener(type, fn);
        delete this.listeners[id];
    }

    _validateData(data) {
        if(!data || !data.id || (!data.parent && !data.parentId)) {
            console.error('Component data missing. Provide an object for the Component with id and parent (or parentId).', data);
        }
    }

    _createDefaultTemplate(data) {
        const { id, tag } = data;
        if(tag) {
            return `<${tag} id="${id}"></${tag}>`;
        } else {
            return `<div id="${id}"></div>`; // Default
        }
    }
}

export default Component;