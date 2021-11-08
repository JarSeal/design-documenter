const formsRouter = require('express').Router();
const Form = require('./../models/form');
const newUserFormData = require('./forms/newUserFormData');

// Get all forms
formsRouter.get('/', async (request, response) => {
    const result = await Form.find({});
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    const formId = request.params.id;
    let result = await Form.findOne({ formId });

    if(!result) {
        result = await _createPresetForm(formId);
    }

    if(!result) {
        response.status(404).json({ msg: 'Could not find form.', id: formId });
    } else {
        response.json(result.form);
    }
});

// Create a new form
formsRouter.post('/', async (request, response) => {
    request, response;
});

const _createPresetForm = async (id) => {
    let newForm, form;
    if(id === 'new-user-form') {
        form = { formId: id, form: newUserFormData };
        newForm = new Form(form);
        await newForm.save();
        return form;
    } else {
        return null;
    }
};

module.exports = formsRouter;