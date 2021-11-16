const formsRouter = require('express').Router();
const bcrypt = require('bcrypt');
const CONFIG = require('./../shared').CONFIG.USER;
const logger = require('./../utils/logger');
const Form = require('./../models/form');
const { validatePrivileges } = require('./forms/formEngine');
const createPresetForms = require('./forms/createPresetForms');

// Get all forms
formsRouter.get('/', async (request, response) => {
    await createPresetForms();

    const result = await Form.find({});
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    await createPresetForms();

    const formId = request.params.id;
    let result = await Form.findOne({ formId });
    if(!result) {
        logger.log(`Could not find form with id '${formId}'.`, request.token);
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
    response.json(form);
});

module.exports = formsRouter;