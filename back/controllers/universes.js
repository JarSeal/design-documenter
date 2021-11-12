const universeRouter = require('express').Router();
const logger = require('./../utils/logger');
const Universe = require('./../models/universe');
const Form = require('./../models/form');
const { validateFormData } = require('./forms/formValidator');

// Get all universes
universeRouter.get('/', async (request, response) => {
    const result = await Universe.find({}).sort({ 'created.date': 'desc' });
    response.json(result);
});

universeRouter.get('/:id', async (request, response) => {
    const result = await Universe.findOne({ universeId: request.params.id });
    response.json(result);
});

// Create a new universe
universeRouter.post('/', async (request, response) => {
    // if(!request.token || !request.decodedToken.id) {
    //     return response.status(401).json({ error: 'token missing or invalid' });
    // }
    const body = request.body;
    const formData = await Form.findOne({ formId: body.id });
    const error = validateFormData(formData, body);
    if(error) {
        return response.status(error.code).json(error.obj);
    }

    const findUniverse = await Universe.findOne({ universeId: body.universeId.trim() });
    if(findUniverse) {
        return response.json({
            msg: 'Bad request. Validation errors.',
            errors: { universeId: 'universe_id_taken' },
        });
    }

    const universe = new Universe({
        title: body.universeTitle.trim(),
        universeId: body.universeId.trim(),
        description: body.universeDescription.trim(),
        created: {
            by: null,
            date: new Date(),
        },
    });

    const savedUniverse = await universe.save();
    
    logger.log(`Created universe ${body.universeTitle.trim()} (id: ${body.universeId.trim()}).`);

    response.json(savedUniverse);
});

module.exports = universeRouter;