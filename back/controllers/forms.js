const formsRouter = require('express').Router();
const logger = require('./../utils/logger');
const Form = require('./../models/form');
const User = require('./../models/user');
const AdminSetting = require('./../models/adminSetting');
const UserSetting = require('./../models/userSetting');
const { validatePrivileges } = require('./forms/formEngine');
const { getSetting } = require('../utils/settingsService');
const { isValidObjectId } = require('mongoose');

// Get all forms
formsRouter.get('/', async (request, response) => {

    // TODO: needs access right check, but for now, this is good for debugging
    const result = await Form.find({});
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    
    let formId, splitId = [];
    const id = request.params.id;
    if(id.includes('+')) {
        splitId = id.split('+');
        formId = splitId[0];
    } else {
        formId = id;
    }
    let result = await Form.findOne({ formId });
    if(!result) {
        logger.log(`Could not find form with id '${formId}'.`);
        return response.status(404).json({ msg: 'Could not find form.', id: formId });
    }
    const error = await validatePrivileges(result, request);
    if(error) {
        return response.status(error.code).json(error.obj);
    }
    
    const form = result.form;
    form.id = result.formId;
    form.api = result.path;
    form.method = result.method;

    if(splitId.length) {
        form.data = await getAdditionalData(formId, splitId[1], request);
        if(form.data._error) {
            logger.log(`Error with additional form data. FormId: '${formId}'. Additional Id: '${splitId[1]}'. (+ form.data._error)`, form.data._error);
            return response.status(form.data._error.code).json(form.data._error.obj);
        }
        if(form.singleEdit) {
            let fieldFound = false, fsFound = false;
            for(let i=0; i<form.fieldsets.length; i++) {
                const fs = form.fieldsets[i];
                if(!fieldFound) {
                    for(let j=0; j<fs.fields.length; j++) {
                        const field = fs.fields[j];
                        if(form.data[field.id] !== undefined) {
                            fieldFound = field;
                            break;
                        }
                    }
                }
                if(!fsFound && fieldFound) {
                    fs.fields = [
                        {type:'divider'},
                        fieldFound,
                        {type:'divider'},
                    ];
                    fsFound = fs;
                    break;
                }
            }
            form.fieldsets = [fsFound];
        }
    }

    response.json(form);
});

const getAdditionalData = async (formId, dataId, request) => {
    const userLevel = request.session.userLevel;
    if(formId === 'edit-user-form') {
        const user = await User.findById(dataId);
        if(!user) {
            return {
                _error: { code: 404,
                    obj: {
                        msg: 'Could not find user.',
                        userNotFound: true,
                    },
                },
            };
        } else if(user.userLevel >= userLevel) {
            return {
                _error: { code: 401,
                    obj: {
                        msg: 'Not authorised to edit user.',
                        userLevelError: true,
                    },
                },
            };
        }
        return user;
    } else if(formId === 'edit-profile-form' && dataId === 'own') {
        const user = await User.findById(request.session._id);
        if(!user) {
            return {
                _error: { code: 404,
                    obj: {
                        msg: 'Could not find user.',
                        userNotFound: true,
                    },
                },
            };
        }
        return user;
    } else if(formId === 'admin-settings-form') {
        let setting = await AdminSetting.findById(dataId);
        if(!setting) {
            return {
                _error: { code: 404,
                    obj: {
                        msg: 'Could not find admin setting.',
                        settingNotFound: true,
                    },
                },
            };
        }
        setting[setting.settingId] = setting.value;
        const settingValue = {};
        settingValue[setting.settingId] = setting.value;
        return settingValue;
    } else if(formId === 'user-settings-form') {
        let setting;
        if(isValidObjectId(dataId)) {
            setting = await UserSetting.findById(dataId);
        } else {
            await getSetting(request, dataId, false, true); // Creates the setting
            setting = await UserSetting.findOne({ settingId: dataId, userId: request.session._id });
        }
        if(!setting) {
            return {
                _error: { code: 404,
                    obj: {
                        msg: 'Could not find user setting.',
                        settingNotFound: true,
                    },
                },
            };
        }
        setting[setting.settingId] = setting.value;
        const settingValue = {};
        settingValue[setting.settingId] = setting.value;
        return settingValue;
    } else {
        return {
            _error: { code: 400,
                obj: {
                    msg: 'This is still WIP / TODO.',
                    wipError: true,
                },
            },
        };
    }
};

module.exports = formsRouter;