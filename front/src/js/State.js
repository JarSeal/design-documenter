class State {
    constructor(initState) {
        this.initState = initState;
        this.state = initState || {};
        this.listeners = [];
        this.listenerCallbacks = [];
    }

    set(key, value, listenerCallback) {
        if(listenerCallback) this.addListener(key, listenerCallback);

        const keys = key.split('.');
        let oldValue;

        // Flat keys (one level)
        if(keys.length === 1) {
            oldValue = this.state[keys[keys.length-1]];
            this._checkListeners(oldValue, value, key);
            this.state[keys[0]] = value;
            return;
        }

        // Deep keys
        let pos = this.state[keys[0]];
        if(pos === undefined) this.state[keys[0]] = pos = {}; // Create a new object if not found
        for(let i=1; i<keys.length-1; i++) {
            if(pos[keys[i]] === undefined) pos[keys[i]] = {}; // Create a new object if not found
            pos = pos[keys[i]];
        }
        oldValue = pos[keys[keys.length-1]];
        this._checkListeners(oldValue, value, key);
        pos[keys[keys.length-1]] = value;
    }

    get(key) {
        const keys = key.split('.');
        
        // Flat keys (one level)
        if(keys.length === 1) {
            return this.state[key];
        }

        // Deep keys
        let pos = this.state[keys[0]];
        for(let i=1; i<keys.length; i++) {
            if(pos === undefined || pos[keys[i]] === undefined) return undefined;
            pos = pos[keys[i]];
        }
        
        return pos;
    }

    remove(key) {
        this.removeListener(key);

        const keys = key.split('.');
        
        // Flat keys (one level)
        if(keys.length === 1) {
            if(this.state[key] === undefined) return;
            delete this.state[key];
            return;
        }

        // Deep keys
        let pos = this.state[keys[0]];
        for(let i=1; i<keys.length-1; i++) {
            if(pos === undefined || pos[keys[i]] === undefined) return;
            pos = pos[keys[i]];
        }
        if(pos === undefined) return;

        delete pos[keys[keys.length-1]];
    }

    getObject() {
        // Return full state
        return this.state;
    }

    addListener(key, callback) {
        this.listeners.push(key);
        this.listenerCallbacks.push(callback);
    }

    removeListener(key) {
        const index = this.listeners.indexOf(key);
        if(index > -1) {
            this.listeners.splice(index, 1);
            this.listenerCallbacks.splice(index, 1);
        }
    }
    
    _checkListeners(oldValue, value, key) {
        if(oldValue === value) return;
        const index = this.listeners.indexOf(key);
        if(index > -1) {
            this.listenerCallbacks[index](value, oldValue);
        }
    }
}

export default State;