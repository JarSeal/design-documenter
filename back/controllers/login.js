const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('./../models/user');
const Form = require('./../models/form');
const { checkAccess } = require('../utils/checkAccess');
// const Universe = require('./../models/universe');

loginRouter.post('/access', async (request, response) => {

    const result = {};
    let check;
    if(request.body.from === 'admin') {
        check = await Form.find({ admin: true });
        console.log('CHECKING ADMIN', check);
    } else {
        const ids = request.body.ids;
        for(let i=0; i<ids.length; i++) {
            if(ids[i].from === 'universe') {
                // TODO, do universe here (find by universeId)
            } else { // Default is Form
                check = await Form.findOne({ formId: ids[i].id });
            }
            result[ids[i].id] = checkAccess(request, check);
        }
    }
    
    return response.json(result);
});

loginRouter.post('/', async (request, response) => {

    const body = request.body;

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if(!(user && passwordCorrect)) {
        // Login counter here and create a cool down period for x wrong logins
        return response.status(401).json({
            error: 'invalid username and/or password',
        });
    }

    const userForToken = {
        username: user.username,
        userLevel: user.userLevel,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    request.session.username = user.username;
    request.session.userLevel = user.userLevel;
    request.session._id = user._id;

    response
        .status(200)
        .send({
            // token,
            username: user.username,
        });
});

module.exports = loginRouter;