const formsRouter = require('express').Router();
const Form = require('./../models/form');
const { validateField, validateKeys } = require('./forms/formValidator');
const newUserFormData = require('./forms/newUserFormData');

// Get all forms
formsRouter.get('/', async (request, response) => {
    let result = await Form.find({});
    if(result.length < presetForms.length) {
        // Create missing forms
        for(let i=0; i<presetForms.length; i++) {
            result = await Form.findOne({ formId: presetForms[i] });
            if(!result) await _createPresetForm(presetForms[i]);
        }
        result = await Form.find({});
    }
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
    // TODO
});

// Send a filled form
formsRouter.post('/filled', async (request, response) => {
    const body = request.body;
    const formData = await Form.findOne({ formId: body.id });
    if(!formData || !formData.form) {
        response.status(404).json({ msg: 'Could not find form (' + body.id + '),' });
        return;
    }

    const keys = Object.keys(body);
    const keysFound = validateKeys(formData.form, keys);
    if(!keysFound) {
        response.status(400).json({ msg: 'Bad request. Payload missing or incomplete.' });
        return;
    }

    const errors = {};
    for(let i=0; i<keys.length; i++) {
        // Payload contains extra/undefined keys or no keys at all
        let error = validateField(formData.form, keys[i], body[keys[i]]);
        if(error) errors[keys[i]] = error;
    }
    const errorKeys = Object.keys(errors);
    if(errorKeys.length) {
        response.status(400).json({ msg: 'Bad request. Validation errors.', errors });
        return;
    }

    if(body.id === 'new-user-form') {
        // Special case for registering a new user
        
    }
    response.json({ msg: 'filledForm' });
    // TODO
});

const presetForms = ['new-user-form'];
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