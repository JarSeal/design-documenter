let all = {};

const AdminSetting = require('../models/adminSetting');
const { checkIfLoggedIn } = require('./checkAccess');

const reloadSettings = async (request) => {
    const adminSettings = await AdminSetting.find({});
    all = {};
    let userLevel = 0;
    if(checkIfLoggedIn(request)) userLevel = request.session.userLevel;
    for(let i=0; i<adminSettings.length; i++) {
        if(userLevel >= adminSettings[i].settingReadRight) {
            all[adminSettings[i].settingId] = getValue(adminSettings[i]);
        }
    }
};

const getSettings = async (request, noReload) => {
    if(!noReload) {
        await reloadSettings(request);
    }
    return all;
};

const getSetting = async (request, id, admin, noReload) => {
    if(!noReload) {
        let setting;
        admin
            ? setting = await AdminSetting.find({ settingId: id })
            : null; // TODO: Add regular user settings here
        if(!setting) return null;
        let userLevel = 0;
        if(checkIfLoggedIn(request.session)) userLevel = request.session.userLevel;
        if(userLevel >= setting.settingReadRight) all[id] = getValue(setting);
    }
    return all[id];
};

const getValue = (setting) => {
    if(setting.type === 'integer') {
        return parseInt(setting.value);
    } else if(setting.type === 'boolean') {
        return setting.value === 'true' ? true : false;
    } else {
        // String by default
        return setting.value;
    }
};

const getPublicSettings = async (request, noReload) => {
    if(!noReload) {
        await reloadSettings(request);
    }
    const publicSettings = {};
    const keys = Object.keys(publicSettingsRemapping);
    for(let i=0; i<keys.length; i++) {
        const newKey = publicSettingsRemapping[keys[i]].newKey;
        // publicSettings[newKey] = all[keys[i]];
        publicSettings[newKey] = publicSettingsRemapping[keys[i]].createValue(all[keys[i]], request);
    }
    return publicSettings;
};

const publicSettingsRemapping = {
    'public-user-registration': {
        newKey: 'canCreateUser',
        createValue: (value, request) => {
            if(checkIfLoggedIn(request.session)) {
                return all['user-level-required-to-register'] <= request.session.userLevel;
            }
            return value;
        },
    },
};

module.exports = {
    getSettings,
    getSetting,
    getPublicSettings,
};