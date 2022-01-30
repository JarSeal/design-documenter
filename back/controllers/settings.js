const settingsRouter = require('express').Router();
const adminSettingsFormData = require('./../../shared/formData/adminSettingsFormData');
const userSettingsFormData = require('./../../shared/formData/userSettingsFormData');
const logger = require('./../utils/logger');
const AdminSetting = require('./../models/adminSetting');
const UserSetting = require('./../models/userSetting');
const { createNewEditedArray } = require('./../utils/helpers');
const { getAndValidateForm } = require('./forms/formEngine');


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


// Get all admin settings values
settingsRouter.get('/admin', async (request, response) => {

    const formId = adminSettingsFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    const result = await AdminSetting.find({});

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
        logger.error('Could not find value with key \'' + setting.settingId + '\' in the payload. (+ body)', body);
        response.status(400).json({
            msg: 'Bad request.',
            settingValueNotFoundError: true,
        });
        return;
    }
    const edited = await createNewEditedArray(setting.edited, request.session._id);

    const updatedAdminSetting = {
        value: body[setting.settingId],
        edited,
    };

    const savedSetting = await AdminSetting.findByIdAndUpdate(body.mongoId, updatedAdminSetting, { new: true });
    if(!savedSetting) {
        logger.error('Could not find admin setting. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    }
    logger.log(`Setting '${savedSetting.settingId}' was changed.`);
    response.json(savedSetting);
});

module.exports = settingsRouter;