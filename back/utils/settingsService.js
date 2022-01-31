const AdminSetting = require('../models/adminSetting');
const UserSetting = require('../models/userSetting');
const userSettingsFormData = require('./../../shared/formData/userSettingsFormData');
const { checkIfLoggedIn } = require('./checkAccess');

let all = {},
    onceLoaded = false;

const reloadSettings = async (request) => {
    const adminSettings = await AdminSetting.find({});
    all = {};
    let userLevel = 0;
    const loggedIn = checkIfLoggedIn(request.session);
    if(loggedIn) userLevel = request.session.userLevel;
    for(let i=0; i<adminSettings.length; i++) {
        if(userLevel >= adminSettings[i].settingReadRight) {
            all[adminSettings[i].settingId] = getValue(adminSettings[i]);
        }
    }
    if(loggedIn) {
        const fieldSets = userSettingsFormData.form.fieldsets;
        for(let i=0; i<fieldSets.length; i++) {
            const fs = fieldSets[i];
            for(let j=0; j<fs.fields.length; j++) {
                const field = fs.fields[j];
                const setting = await UserSetting.findOne({
                    userId: request.session._id,
                    settingId: field.id,
                });
                if(!setting) {
                    all[field.id] = await getDefaultValue(field.id, request);
                } else {
                    all[field.id] = getValue(setting);
                }
            }
        }
    }
    onceLoaded = true;
};

const getSettings = async (request, noReload) => {
    if(!noReload || !onceLoaded) {
        await reloadSettings(request);
    }
    return all;
};

const getSetting = async (request, id, admin, noReload) => {
    if(!noReload) {
        const loggedIn = checkIfLoggedIn(request.session);
        let setting;
        admin
            ? setting = await AdminSetting.findOne({ settingId: id })
            : loggedIn
                ? setting = await UserSetting.findOne({ settingId: id, userId: request.session._id })
                : null;
        if(!setting) return null;
        let userLevel = 0;
        if(loggedIn) userLevel = request.session.userLevel;
        if(userLevel >= setting.settingReadRight) all[id] = setting
            ? getValue(setting)
            : await getDefaultValue(setting, request);
    }
    let value = all[id];
    if(value === undefined) {
        let setting = await UserSetting.findOne({ settingId: id, userId: request.session._id });
        value = setting
            ? getValue(setting)
            : await getDefaultValue(id, request);
    }
    return value;
};

const getDefaultValue = async (setting, request) => {
    const fieldSets = userSettingsFormData.form.fieldsets;
    for(let i=0; i<fieldSets.length; i++) {
        const fs = fieldSets[i];
        for(let j=0; j<fs.fields.length; j++) {
            const field = fs.fields[j];
            if(setting.settingId === field.id || setting === field.id) {
                const newSetting = new UserSetting({
                    settingId: field.id,
                    userId: request.session._id,
                    value: field.defaultValue,
                    defaultValue: field.defaultValue,
                    type: field.settingType,
                });
                await newSetting.save();
                return field.defaultValue;
            }
        }
    }
    return null;
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
    if(!noReload || !onceLoaded) {
        await reloadSettings(request);
    }
    const publicSettings = {};
    const keys = Object.keys(publicSettingsRemapping);
    for(let i=0; i<keys.length; i++) {
        const newKey = publicSettingsRemapping[keys[i]].newKey;
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
    'table-sorting-setting': {
        newKey: 'tableSorting',
        createValue: (value) => { return value; },
    },
};

module.exports = {
    getSettings,
    getSetting,
    getPublicSettings,
};