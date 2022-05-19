const CryptoJS = require('crypto-js');
const settingsRouter = require('express').Router();
const adminSettingsFormData = require('./../../shared/formData/adminSettingsFormData');
const userSettingsFormData = require('./../../shared/formData/userSettingsFormData');
const logger = require('./../utils/logger');
const AdminSetting = require('./../models/adminSetting');
const UserSetting = require('./../models/userSetting');
const { createNewEditedArray } = require('./../utils/helpers');
const { getAndValidateForm } = require('./forms/formEngine');
const { getPublicSettings } = require('../utils/settingsService');


// Get all user settings values
settingsRouter.get('/', async (request, response) => {

    const formId = userSettingsFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    const result = await UserSetting.find({ userId: request.session._id });

    response.json(result);
});


// Edit user settings
settingsRouter.put('/', async (request, response) => {

    const body = request.body;
    const error = await getAndValidateForm(body.id, 'PUT', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const setting = await UserSetting.findById(body.mongoId);
    if(!setting) {
        logger.error('Could not find user setting. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    } else if(body[setting.settingId] === null || body[setting.settingId] === undefined) {
        logger.error('Could not find value with key \'' + setting.settingId + '\' in the payload for editing a user setting. (+ body)', body);
        response.status(400).json({
            msg: 'Bad request.',
            settingValueNotFoundError: true,
        });
        return;
    }

    const updatedUserSetting = {
        value: body[setting.settingId],
    };

    const savedSetting = await UserSetting.findByIdAndUpdate(body.mongoId, updatedUserSetting, { new: true });
    if(!savedSetting) {
        logger.error('Could not find user setting after save. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    }
    logger.log(`Setting '${savedSetting.settingId}' was changed (user setting).`);
    const publicSettings = await getPublicSettings(request);
    response.json(publicSettings);
});


// Get all admin settings values
settingsRouter.get('/admin', async (request, response) => {

    const formId = adminSettingsFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    const result = await AdminSetting.find({});

    // Decrypt passwords
    for(let i=0; i<result.length; i++) {
        const setting = result[i];
        if(setting.password) {
            const bytes = CryptoJS.AES.decrypt(setting.value, process.env.SECRET);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            result[i].value = originalText;
        }
    }
    
    response.json(result);
});


// Edit admin settings
settingsRouter.put('/admin', async (request, response) => {

    const body = request.body;
    const error = await getAndValidateForm(body.id, 'PUT', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const setting = await AdminSetting.findById(body.mongoId);
    if(!setting) {
        logger.error('Could not find admin setting. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    } else if(body[setting.settingId] === null || body[setting.settingId] === undefined) {
        logger.error('Could not find value with key \'' + setting.settingId + '\' in the payload for editing an admin setting. (+ body)', body);
        response.status(400).json({
            msg: 'Bad request.',
            settingValueNotFoundError: true,
        });
        return;
    }

    const edited = await createNewEditedArray(setting.edited, request.session._id);
    let value = body[setting.settingId];
    
    if(setting.password && value !== '') {
        value = CryptoJS.AES.encrypt(value, process.env.SECRET).toString();
    }
    
    const updatedAdminSetting = {
        value,
        edited,
    };

    const savedSetting = await AdminSetting.findByIdAndUpdate(body.mongoId, updatedAdminSetting, { new: true });
    if(!savedSetting) {
        logger.error('Could not find admin setting after save. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    }
    logger.log(`Setting '${savedSetting.settingId}' was changed (admin setting).`);
    const publicSettings = await getPublicSettings(request);
    response.json(publicSettings);
});

module.exports = settingsRouter;