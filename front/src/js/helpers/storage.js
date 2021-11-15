import axios from "axios";
import { LocalStorage, SessionStorage } from "../LIGHTER";
import { _CONFIG } from "../_CONFIG";

let LStorage, SStorage, user;

const saveUser = (response, remember) => {
    const LS = getStorage('LS');
    const SS = getStorage('SS');
    if(response && response.data && response.data.token) {
        user = {};
        user.token = response.data.token;
        user.username = response.data.username;
    }
    if(remember) {
        LS.setItem('beaconUser', JSON.stringify(response.data));
        SS.removeItem('beaconUser');
    } else {
        LS.removeItem('beaconUser');
        SS.setItem('beaconUser', JSON.stringify(response.data));
    }
};

const getUser = () => {
    if(user && user.token) return user;
    const LS = getStorage('LS');
    const SS = getStorage('SS');
    let user = LS.getItem('beaconUser');
    if(!user) user = SS.getItem('beaconUser');
    if(user) user = JSON.parse(user);
    return user;
};

const getApiHeaders = () => {
    const user = getUser();
    const token = user ? user.token : null;
    if(!token) return {};
    return {
        headers: { Authorization: `bearer ${token}` },
    };
};

const removeUser = () => {
    user = null;
    const LS = getStorage('LS');
    const SS = getStorage('SS');
    LS.removeItem('beaconUser');
    SS.removeItem('beaconUser');
};

const getStorage = (type) => {
    if(type === 'LS') {
        if(!LStorage) {
            LStorage = new LocalStorage(_CONFIG.lsKeyPrefix);
        }
        return LStorage;
    } else if(type === 'SS') {
        if(!SStorage) {
            SStorage = new SessionStorage(_CONFIG.ssKeyPrefix);
        }
        return SStorage;
    }
    return null;
};

const checkCredentials = async (required, curRoute) => {
    const config = getApiHeaders();
    const url = _CONFIG.apiBaseUrl + '/login';
    const response = await axios.get(url, config);
    if(response.data.userLevel < required.userLevel) {
        if(response.data.userLevel === 0) return '/';
        return '/401';
    }
    return null;
};

export {
    saveUser,
    getUser,
    removeUser,
    getApiHeaders,
    getStorage,
    checkCredentials,
};