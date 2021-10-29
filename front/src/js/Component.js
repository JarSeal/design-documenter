import { RouterRef } from "./Router";

class Component {
    constructor(data) {
        if(!data || !data.id) console.error('Component id missing.', data);
        this.id = data.id;
        this.data = data;
        this.parent;
        this.parentId = data.parentId ? data.parentId : null;
        this.template;
        this.elem;
        this.listeners = {};
        this.children = {};
        this.Router = RouterRef;
        // *****************
        // [ RESERVED KEYS ]
        // data = {
        //     id, (required, string)
        //     parentId, (optional, string, used when addChild from with the parent method is not possible)
        //     replace, (optional, boolean, default=false, whether the Component should replace the parent's innerHTML or not)
        //     class, (optional, string/array, element classe(s))
        //     text, (optional, string, element innerHTML text/html)
        //     tag, (optional, string, element tag name/type)
        //     template (optional, string, default=<div id="${data.id}"></div>, element HTML)
        // }
    }

    draw() { // Main Component drawing logic
        if(this.elem) this.discard();
        const data = this.data;
        this.parent = document.getElementById(this.parentId);
        if(!this.template) this.template = data.template || this._createDefaultTemplate(this.id, data);
        this.template = this._templateId(this.template, data);
        if(data.replace) {
            // Exclusive element draw to parent's innerHTML
            this.parent.innerHTML = this.template;
        } else {
            // Append element to parent's innerHTML
            this.parent.innerHTML += this.template;
        }
        this.elem = document.getElementById(this.id);
        this._setElemData(this.elem, data);
        this.init(data);
    }

    init(data) {} // To start the custom component logic (is called after draw)

    discard() {
        // Remove listeners
        let keys = Object.keys(this.listeners);
        for(let i=0; i<keys.length; i++) {
            this.removeListener(keys[i]);
        }
        // Discard children
        keys = Object.keys(this.children);
        for(let i=0; i<keys.length; i++) {
            this.children[keys[i]].discard();
        }
        // Remove element from DOM
        if(this.elem) {
            this.elem.remove();
            this.elem = null;
        }
        this.discardExtension();
    }

    discardExtension() {} // Additional discard logic from the custom Component

    addChild(component) {
        this.children[component.id] = component;
        component.parentId = this.id;
        return component;
    }

    addListener(listener) {
        let { id, target, type, fn } = listener;
        if(!id || !type || !fn) {
            console.error('Could not add listener, id, type, and/or fn missing.');
        }
        if(!target) {
            target = this.elem;
            listener.target = target;
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

    _templateId(template, data) {
        if(!template.includes(`id="${data.id}"`) && !template.includes(`id='${data.id}'`) && !template.includes(`id=${data.id}`)) {
            template = template.trim();
            const parts = template.split('>');
            parts[0] = parts[0].trim();
            parts[0] += ` id="${data.id}"`;
            template = parts.join('>');
        }
        return template;
    }

    _setElemData(elem, data) {
        if(data.class) {
            if(typeof data.class === 'string' || data.class instanceof String) {
                elem.classList.add(data.class);
            } else {
                elem.classList.add(...data.class);
            }
        }
        if(data.text) elem.innerHTML += data.text;
    }

    _createDefaultTemplate(id, data) {
        const tag = (data && data.tag) ? data.tag : false;
        if(tag) {
            return `<${tag} id="${id}"></${tag}>`;
        } else {
            return `<div id="${id}"></div>`; // Default
        }
    }
}

export default Component;