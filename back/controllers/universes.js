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
    const body = request.body;
    const formData = await Form.findOne({ formId: body.id });
    const error = validateFormData(formData, body);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const findUniverse = await Universe.findOne({ universeId: body.universeId.trim() });
    if(findUniverse) {
        response.json({
            msg: 'Bad request. Validation errors.',
            errors: { universeId: 'universe_id_taken' },
        });
        return;
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