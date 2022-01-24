const settingsRouter = require('express').Router();
const adminSettingsFormData = require('./../../shared/formData/adminSettingsFormData');
// const logger = require('./../utils/logger');
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

    const edited = await createNewEditedArray(body.userId, request.session._id);

    const updatedAdminSetting = {
        edited,
    };

    // const savedUser = await User.findByIdAndUpdate(body.userId, updatedUser, { new: true });
    // if(!savedUser) {
    //     logger.log('Could not update user. User was not found (id: ' + body.userId + ').');
    //     response.status(404).json({
    //         msg: 'User to update was not found. It has propably been deleted by another user.',
    //         userNotFoundError: true,
    //     });
    //     return;
    // }
    // response.json(savedUser);
    response.json(updatedAdminSetting);
});

module.exports = settingsRouter;