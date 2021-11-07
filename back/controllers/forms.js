const formsRouter = require('express').Router();
const Form = require('./../models/form');

// Get all forms
formsRouter.get('/', async (request, response) => {
    const result = await Form.find({});
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    console.log('ID', request.params.id);
    const result = await Form.find({});
    response.json(result);
});

module.exports = formsRouter;