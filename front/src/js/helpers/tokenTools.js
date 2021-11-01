import { LocalStorage } from "../lighter";
import { _CONFIG } from "../_CONFIG";

const saveToken = (response, remember) => {
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    if(remember) {
        LS.setItem('beaconUser', JSON.stringify(response.data));
    } else {
        // TODO: implement session storage here..

        LS.removeItem('beaconUser');
    }
};

const getToken = () => {
    const LS = new LocalStorage(_CONFIG.lsKeyPrefix);
    let user = LS.getItem('beaconUser');
    if(!user) {
        // TODO: try to get from session storage
    }
    if(user) user = JSON.parse(user);
    return user;
};

export { saveToken, getToken };