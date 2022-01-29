const logger = require('./../../utils/logger');
const Form = require('./../../models/form');
const AdminSetting = require('./../../models/adminSetting');
const UserSetting = require('./../../models/userSetting');
const formData = require('./../../shared').formData;
const routeAccess = require('./../../shared').CONFIG.ROUTE_ACCESS;

const createPresetForms = async () => {
    let newForm, checkForm, adminSettings, userSettings;
    for(let i=0; i<formData.length; i++) {
        checkForm = await Form.findOne({ formId: formData[i].formId });
        if(formData[i].formId === 'admin-settings-form') {
            adminSettings = formData[i];
        } else if(formData[i].formId === 'user-settings-form') {
            userSettings = formData[i];
        }
        if(!checkForm) {
            formData[i].created = {
                by: null,
                autoCreated: true,
                date: new Date(),
            };
            newForm = new Form(formData[i]);
            await newForm.save();
            logger.log(`Preset form '${formData[i].formId}' created.`);
        }
    }
    for(let i=0; i<routeAccess.length; i++) {
        checkForm = await Form.findOne({ formId: routeAccess[i].formId });
        if(!checkForm) {
            routeAccess[i].created = {
                by: null,
                autoCreated: true,
                date: new Date(),
            };
            routeAccess[i].type = 'view';
            newForm = new Form(routeAccess[i]);
            await newForm.save();
            logger.log(`Preset form (route access) '${routeAccess[i].formId}' created.`);
        }
    }

    // Create admin settings
    if(adminSettings) {
        const adminFieldsets = adminSettings.form.fieldsets;
        let settingsSaved = 0;
        for(let i=0; i<adminFieldsets.length; i++) {
            const fs = adminFieldsets[i];
            for(let j=0; j<fs.fields.length; j++) {
                const field = fs.fields[j];
                const checkField = await AdminSetting.findOne({ settingId: field.id });
                if(!checkField) {
                    const setting = new AdminSetting({
                        settingId: field.id,
                        value: field.defaultValue,
                        defaultValue: field.defaultValue,
                        labelId: field.labelId,
                        descriptionId: field.descriptionId,
                        settingReadRight: field.settingReadRight || 0,
                        type: field.settingType,
                    });
                    await setting.save();
                    settingsSaved++;
                }
            }
        }
        if(settingsSaved) logger.log(`Saved ${settingsSaved} admin setting${settingsSaved === 1 ? '' : 's'}.`);
    }

    // Create user settings
    if(userSettings) {
        const userFieldsets = userSettings.form.fieldsets;
        let settingsSaved = 0;
        for(let i=0; i<userFieldsets.length; i++) {
            const fs = userFieldsets[i];
            for(let j=0; j<fs.fields.length; j++) {
                const field = fs.fields[j];
                const checkField = await UserSetting.findOne({ settingId: field.id });
                if(!checkField) {
                    const setting = new UserSetting({
                        settingId: field.id,
                        value: field.defaultValue,
                        defaultValue: field.defaultValue,
                        labelId: field.labelId,
                        descriptionId: field.descriptionId,
                        type: field.settingType,
                    });
                    await setting.save();
                    settingsSaved++;
                }
            }
        }
        if(settingsSaved) logger.log(`Saved ${settingsSaved} user setting${settingsSaved === 1 ? '' : 's'}.`);
    }
};

module.exports = createPresetForms;