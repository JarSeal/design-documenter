const logger = require('./../../utils/logger');
const Form = require('./../../models/form');
const formData = require('./../../shared').formData;

const createPresetForms = async () => {
    let newForm, checkForm;
    for(let i=0; i<formData.length; i++) {
        if(formData[i].imported) continue;
        checkForm = await Form.findOne({ formId: formData[i].formId });
        if(!checkForm) {
            newForm = new Form(formData[i]);
            await newForm.save();
            logger.log(`Preset form '${formData[i].formId}' created.`);
        }
        formData[i].imported = true;
    }
};

module.exports = createPresetForms;