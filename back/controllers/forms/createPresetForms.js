const logger = require('./../../utils/logger');
const Form = require('./../../models/form');
const formData = require('./../../shared').formData;
const routeAccess = require('./../../shared').CONFIG.ROUTE_ACCESS;

const createPresetForms = async () => {
    let newForm, checkForm;
    for(let i=0; i<formData.length; i++) {
        checkForm = await Form.findOne({ formId: formData[i].formId });
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
};

module.exports = createPresetForms;