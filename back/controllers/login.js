const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('./../models/user');
const createPresetForms = require('./forms/createPresetForms');

loginRouter.get('/', async (request, response) => {
    await createPresetForms();

    // TRASH
    if(!request.token || !request.decodedToken.userLevel) {
        return response.json({ userLevel: 0 });
    }
    return response.json({ userLevel: request.decodedToken.userLevel });
});

loginRouter.post('/', async (request, response) => {
    await createPresetForms();

    const body = request.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if(!(user && passwordCorrect)) {
        // Login counter here and create a cool down period for x wrong logins
        return response.status(401).json({
            error: 'invalid username and/or password',
            errors: { username: true, password: true, },
        });
    }

    const userForToken = {
        username: user.username,
        userLevel: user.userLevel,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
        .status(200)
        .send({
            token,
            username: user.username,
        });
});

module.exports = loginRouter;