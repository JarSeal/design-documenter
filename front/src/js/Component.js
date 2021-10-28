class Component {
    constructor(data) {
        this.data = data;
        this.id = data.id;
        this.elem;
        this.parent;
        this.parentId;
        this.template;
        this._validateData(data);
    }

    init(data) {}

    draw() {
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

    discard() {}

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
            return `<div id="${id}"></div>`;
        }
    }
}

export default Component;