import { RouterRef } from "./Router";
import { Logger } from "./utils";

const ids = {};
const logger = new Logger('LIGHTER.js COMPO *****');

class Component {
    constructor(data) {
        if(!data || !data.id) {
            logger.error('Component id missing.', data);
            throw new Error('Call stack');
        }
        if(ids[data.id]) {
            logger.error('ID is already in use.', data);
            throw new Error('Call stack');
        }
        ids[data.id] = true;
        this.id = data.id;
        this.data = data;
        this.parent;
        this.parentId = data.parentId ? data.parentId : null;
        this.template;
        this.elem;
        this.listeners = {};
        this.children = {};
        this.Router = RouterRef;
        this.logger = logger;
        this.firstDraw = true;
        // *****************
        // [ RESERVED KEYS ]
        // data = {
        //     id, (required, string)
        //     parentId (optional, string, used when addChild from with the parent method is not possible)
        //     replace (optional, boolean, default=false, whether the Component should replace the parent's innerHTML or not)
        //     class (optional, string/array, element classe(s))
        //     style (optional, flat object, element inline style(s))
        //     appendHtml (optional, string, element's appended innerHTML text/html)
        //     html (optional, string, element's replacing innerHTML text/html)
        //     text (optional, string, element innerText text)
        //     tag (optional, string, element tag name/type)
        //     attach (optional, string, an alternate element id to add the component)
        //     template (optional, string, default=<div id="${data.id}"></div>, element HTML)
        //     noRedraws (optional, boolean, whether the element shouldn't be redrawn after the first draw)
        // }
    }

    draw(drawInput) { // Main Component drawing logic
        if(!this.parentId) {
            logger.error('Parent id missing. New Component creation should have a parentId or the the creation should be wrapped in this.addChild() method.', this.data);
            throw new Error('Call stack');
        }
        let data = this.data;
        if(drawInput) data = Object.assign(this.data, drawInput);
        if(!this.firstDraw && data.noRedraws) return;
        if(this.elem) this.discard();
        this.parent = document.getElementById(data.attach || this.parentId);
        if(!this.template) this.template = data.template || this._createDefaultTemplate(this.id, data);
        this.template = this._templateId(this.template, data);
        if(data.replace) {
            // Exclusive element draw to parent's innerHTML
            this.parent.innerHTML = this.template;
        } else {
            // Append element as parent's child
            const template = document.createElement('template');
            template.innerHTML = this.template;
            this.parent.appendChild(template.content.firstChild);
        }
        this.elem = document.getElementById(this.id);
        this._setElemData(this.elem, data);
        this.addListeners(data);
        if(this.firstDraw) {
            this.init(data);
            this.firstDraw = false;
        }
        this.paint(data);
    }

    reDrawSelf(drawInput) {
        this.draw(drawInput);
    }

    rePaint() {
        this.paint(this.data);
    }

    init(data) {}
    paint(data) {}

    discard(fullDiscard) {
        // Remove listeners
        let keys = Object.keys(this.listeners);
        for(let i=0; i<keys.length; i++) {
            this.removeListener(keys[i]);
        }
        // Discard children
        keys = Object.keys(this.children);
        for(let i=0; i<keys.length; i++) {
            this.children[keys[i]].discard(fullDiscard);
            if(fullDiscard) delete this.children[keys[i]];
        }
        // Remove element from DOM
        if(this.elem) {
            this.elem.remove();
            this.elem = null;
        }
        if(fullDiscard) delete ids[this.id];
        this.erase();
    }

    erase() {} // Additional discard logic from the custom Component

    drawHTML = () => {
        
    }

    addChild(component) {
        this.children[component.id] = component;
        component.parentId = this.id;
        return component;
    }

    addListener(listener) {
        let { id, target, type, fn } = listener;
        if(!type || !fn) {
            logger.error('Could not add listener, type, and/or fn missing.');
            throw new Error('Call stack');
        }
        if(!id) {
            id = this.id;
            listener.id = id;
        }
        if(!target) {
            target = this.elem;
            listener.target = target;
        }
        if(this.listeners[id]) this.removeListener(id);
        target.addEventListener(type, fn);
        this.listeners[id] = listener;
    }

    addListeners() {}

    registerListeners() {
        const listeners = this.defineListeners();
        for(let i=0; i<listeners.length; i++) {
            this.addListener(listeners[i]);
        }
    }

    removeListener(id) {
        if(!id) {
            logger.error('Could not remove listener, id missing.');
            throw new Error('Call stack');
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
                // data.class is propably an array then
                elem.classList.add(...data.class);
            }
        }
        if(data.style) {
            const keys = Object.keys(data.style);
            for(let i=0; i<keys.length; i++) {
                elem.style[keys[i]] = data.style[keys[i]];
            }
        }
        if(data.text) elem.innerText = data.text;
        if(data.html) elem.innerHTML = data.html;
        if(data.appendHtml) elem.innerHTML += data.appendHtml;
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