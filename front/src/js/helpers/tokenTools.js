import { LocalStorage, SessionStorage } from "../lighter";
import { _CONFIG } from "../_CONFIG";

const saveToken = (response, remember) => {
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    const SS = new SessionStorage(_CONFIG.lsKeyPrefix);
    if(remember) {
        LS.setItem('beaconUser', JSON.stringify(response.data));
        SS.removeItem('beaconUser');
    } else {
        LS.removeItem('beaconUser');
        SS.setItem('beaconUser', JSON.stringify(response.data));
    }
};

const getToken = () => {
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    const SS = new SessionStorage(_CONFIG.lsKeyPrefix);
    let user = LS.getItem('beaconUser');
    if(!user) user = SS.getItem('beaconUser');
    if(user) user = JSON.parse(user);
    return user;
};

const removeToken = () => {
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    const SS = new SessionStorage(_CONFIG.lsKeyPrefix);
    LS.removeItem('beaconUser');
    SS.removeItem('beaconUser');
};

export { saveToken, getToken, removeToken };