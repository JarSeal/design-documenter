import axios from "axios";
import { LocalStorage, SessionStorage, Logger } from "../LIGHTER";
import { _CONFIG } from "../_CONFIG";

let LStorage, SStorage, user, access, latestAccessCheck;

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
        headers: {
            Authorization: `bearer ${token}`
        },
        withCredentials: true,
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

const old_checkCredentials = async (required, curRoute) => {
    const timestamp = Date.now() / 1000 | 0;
    if(!access || timestamp > latestAccessCheck + 20) { // 20 second cache
        const config = getApiHeaders();
        const url = _CONFIG.apiBaseUrl + '/api/login';
        try {
            const response = await axios.get(url, config);
            latestAccessCheck = Date.now() / 1000 | 0;
            access = { userLevel: response.data.userLevel };
            if(response.data.userLevel < required.userLevel) {
                if(response.data.userLevel === 0) return '/';
                return '/401';
            }
        }
        catch(exception) {
            const logger = new Logger('checkCredentials: *****');
            logger.error('Could not check credentials', exception);
            throw new Error('Call stack');
        }
    } else {
        if(access.userLevel < required.userLevel) {
            if(access.userLevel === 0) return '/';
            return '/401';
        }
    }
    return null;
};

const checkRouteAccess = async (routeData) => {
    if(!routeData || !routeData.route) {
        const logger = new Logger('checkRouteAccess: *****');
        logger.error('Could not check route access, routeData or routeData.route missing.');
        throw new Error('Call stack');
    }
    const id = routeData.route.id;
    const config = getApiHeaders();
    const url = _CONFIG.apiBaseUrl + '/api/login/access';
    const payload = { ids: [{
        from: 'form',
        id
    }] };
    try {
        const response = await axios.post(url, payload, config);
        const access = response.data[id];
        if(!access) {
            if(getUser()) return '/401';
            return '/login';
        }
    }
    catch(exception) {
        const logger = new Logger('checkRouteAccess: *****');
        logger.error('Could not check route access', exception);
        throw new Error('Call stack');
    }
    return null;
};

const getAdminRights = async () => {
    const config = getApiHeaders();
    const url = _CONFIG.apiBaseUrl + '/api/login/access';
    const payload = { from: 'admin' };
    try {
        const response = await axios.post(url, payload, config);
        const access = response.data;
        console.log('RESPONSE for access', access);
    }
    catch(exception) {
        const logger = new Logger('getAdminRights: *****');
        logger.error('Could not get admin rights', exception);
        throw new Error('Call stack');
    }
    return null;
};

export {
    saveUser,
    getUser,
    removeUser,
    getApiHeaders,
    getStorage,
    checkRouteAccess,
    getAdminRights,
};