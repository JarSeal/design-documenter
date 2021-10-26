class State {
    constructor(initState) {
        this.initState = initState;
        this.state = initState || {};
        this.listeners = [];
        this.listenerCallbacks = [];
    }

    set(key, value) {
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
        for(let i=1; i<keys.length-1; i++) {
            if(pos[keys[i]] === undefined) {
                console.error(`pos is undefined (index: ${i}, key: ${key})`); // TODO: Add to Logger
            }
            pos = pos[keys[i]];
        }
        oldValue = pos[keys[keys.length-1]];
        this._checkListeners(oldValue, value, key);
        pos[keys[keys.length-1]] = value;
    }

    get(key) {
        // TODO: Do all key levels checking
        return this.state[key];
    }

    getObject() {
        // Return full state
        return this.state;
    }

    remove(key) {
        // TODO: Do all key levels checking
        delete this.state[key];
    }

    addListener(key, callback) {
        this.listeners.push(key);
        this.listenerCallbacks.push(callback);
    }

    removeListener(key) {
        // TODO
    }
    
    _checkListeners(oldValue, value, key) {
        if(oldValue === value) return;
        const index = this.listeners.indexOf(key);
        if(index > -1) this.listenerCallbacks[index](value, oldValue);
    }
}

export default State;