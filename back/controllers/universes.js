const universeRouter = require('express').Router();
const Universe = require('./../models/universe');

// Get all universes
universeRouter.get('/', async (request, response) => {
    const result = await Universe.find({}).sort({ 'created.date': 'desc' });
    response.json(result);
});

universeRouter.get('/:id', async (request, response) => {
    const result = await Universe.findOne({ universeId: request.params.id });
    response.json(result);
});

module.exports = universeRouter;