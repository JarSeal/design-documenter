
// Local Storage
class LocalStorage {
    constructor(keyPrefix) {
        this.keyPrefix = keyPrefix || '';
        this.localStorageAvailable = false;
        if(this._lsTest()) {
            this.localStorageAvailable = true;
        }
    }

    getItem(key, defaultValue) {
        // defaultValue is returned (if provided) if local storage is not available or the key is not found
        if(!this.localStorageAvailable) return defaultValue || null;
        if(this.checkIfItemExists(key)) {
            return localStorage.getItem(this.keyPrefix + key);
        } else {
            return defaultValue || null;
        }
    }

    checkIfItemExists(key) {
        if(!this.localStorageAvailable) return false;
        return Object.prototype.hasOwnProperty.call(localStorage, this.keyPrefix + key);
    }

    setItem(key, value) {
        if(!this.localStorageAvailable) return false;
        localStorage.setItem(this.keyPrefix + key, value);
        return true;
    }

    removeItem(key) {
        if(!this.localStorageAvailable) return false;
        if(this.checkIfItemExists(key)) {
            localStorage.removeItem(this.keyPrefix + key);
        }
        return true;
    }

    convertValue(defaultValue, lsValue) {
        if(typeof defaultValue === 'boolean') {
            return (lsValue === 'true');
        } else if(typeof defaultValue === 'number') {
            return Number(lsValue);
        } else {
            // typeof string
            return lsValue;
        }
    }

    _lsTest(){
        var test = this.keyPrefix + 'testLSAvailability';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }
}

class Logger {
    constructor(prefix, quiet) {
        this.prefix = prefix || '';
        this.showLogs = true;
        this.showErrors = true;
        this.showWarnings = true;
        if(quiet) this.turnOff();
    }

    log(...args) {
        if(!this.showLogs) return;
        console.log(this.prefix, ...args);
    }

    error(...args) {
        if(!this.showErrors) return;
        console.error(this.prefix, ...args);
    }

    warn(...args) {
        if(!this.showWarnings) return;
        console.warn(this.prefix, ...args);
    }

    turnOff() {
        this.showLogs = false;
        this.showErrors = false;
        this.showWarnings = false;
    }

    turnOn() {
        this.showLogs = true;
        this.showErrors = true;
        this.showWarnings = true;
    }
}

export { LocalStorage, Logger }