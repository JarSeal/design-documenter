const settingsRouter = require('express').Router();
const adminSettingsFormData = require('./../../shared/formData/adminSettingsFormData');
const logger = require('./../utils/logger');
const AdminSettings = require('./../models/adminSetting');
const { createNewEditedArray, getAndValidateForm } = require('./forms/formEngine');


// Get all admin settings
settingsRouter.get('/admin', async (request, response) => {

    const formId = adminSettingsFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    const result = await AdminSettings.find({}).sort({ orderNr: -1 });

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

    const setting = await AdminSettings.findById(body.mongoId);
    if(!setting) {
        logger.error('Could not find admin setting. Setting was not found (id: ' + body.mongoId + '). (+ body)', body);
        response.status(404).json({
            msg: 'Setting was not found.',
            settingNotFoundError: true,
        });
        return;
    }
    const edited = await createNewEditedArray(setting.edited, request.session._id);

    const updatedAdminSetting = {
        value: body[setting.settingId],
        edited,
    };

    const savedSetting = await AdminSettings.findByIdAndUpdate(body.mongoId, updatedAdminSetting, { new: true });
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