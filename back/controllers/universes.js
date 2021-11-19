const universeRouter = require('express').Router();
const logger = require('./../utils/logger');
const Universe = require('./../models/universe');
const Form = require('./../models/form');
const User = require('./../models/user');
const { validateFormData } = require('./forms/formEngine');

// Get all universes
universeRouter.get('/', async (request, response) => {
    
    const result = await Universe.find({})
        .sort({ 'created.date': 'desc' })
        .populate('created.by', { username: 1, name: 1 });
    response.json(result);
});

// Get one universe
universeRouter.get('/:id', async (request, response) => {

    const result = await Universe.findOne({ universeId: request.params.id })
        .populate('created.by', { username: 1, name: 1 });
    response.json(result);
});

// Create a new universe
universeRouter.post('/', async (request, response) => {

    const body = request.body;
    const formData = await Form.findOne({ formId: body.id });
    
    const user = await User.findById(request.session._id);
    const error = await validateFormData(formData, request, user);
    if(error) {
        logger.log('Error with form validation. (+ error, formId, token)', error, body.id, request.token);
        return response.status(error.code).json(error.obj);
    }

    const findUniverse = await Universe.findOne({ universeId: body.universeId.trim() });
    if(findUniverse) {
        logger.log('Universe id taken. (+ universeId)', body.universeId.trim(), request.token);
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
            by: user.id,
            date: new Date(),
        },
    });

    const savedUniverse = await universe.save();
    
    logger.log(`Created universe '${body.universeTitle.trim()}'' (id: '${body.universeId.trim()}'). (+ token)`, request.token);

    response.json(savedUniverse);
});

module.exports = universeRouter;