import axios from "axios";
import bcryptjs from 'bcryptjs';
import { Logger } from "../LIGHTER";
import { _CONFIG } from "../_CONFIG";

const checkRouteAccess = async (routeData) => {
    if(!routeData || !routeData.route) {
        const logger = new Logger('checkRouteAccess: *****');
        logger.error('Could not check route access, routeData or routeData.route missing.');
        throw new Error('Call stack');
    }
    const id = routeData.route.id;
    const url = _CONFIG.apiBaseUrl + '/api/login/access';
    const payload = { ids: [{
        from: 'form',
        id
    }] };
    try {
        const response = await axios.post(url, payload, { withCredentials: true });
        const access = response.data[id];
        if(!access) {
            if(response.data._sess === false) return '/logout';
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
    const url = _CONFIG.apiBaseUrl + '/api/login/access';
    const payload = { from: 'admin' };
    try {
        const response = await axios.post(url, payload, { withCredentials: true });
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

const createSendToken = async (token, browserId, randomId) => {
    const saltRounds = 10;
    const newToken = await bcryptjs.hash(
        randomId + token + browserId,
        saltRounds,
    );
    return newToken;
};

export {
    checkRouteAccess,
    getAdminRights,
    createSendToken,
};