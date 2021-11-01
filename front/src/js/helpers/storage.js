import { LocalStorage, SessionStorage } from "../lighter";
import { _CONFIG } from "../_CONFIG";

let LStorage, SStorage;

const saveToken = (response, remember) => {
    const LS = getStorage('LS');
    const SS = getStorage('SS');
    if(remember) {
        LS.setItem('beaconUser', JSON.stringify(response.data));
        SS.removeItem('beaconUser');
    } else {
        LS.removeItem('beaconUser');
        SS.setItem('beaconUser', JSON.stringify(response.data));
    }
};

const getToken = () => {
    const LS = getStorage('LS');
    const SS = getStorage('SS');
    let user = LS.getItem('beaconUser');
    if(!user) user = SS.getItem('beaconUser');
    if(user) user = JSON.parse(user);
    return user;
};

const removeToken = () => {
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
            SStorage = new SessionStorage(_CONFIG.lsKeyPrefix);
        }
        return SStorage;
    }
    return null;
};

export { saveToken, getToken, removeToken, getStorage };