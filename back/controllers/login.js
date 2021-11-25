const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('./../models/user');
const Form = require('./../models/form');
const logger = require('./../utils/logger');
const { checkAccess, checkIfLoggedIn } = require('../utils/checkAccess');
const { createRandomString } = require('../../shared/parsers');
// const Universe = require('./../models/universe');

loginRouter.post('/access', async (request, response) => {

    const result = {};
    let check, browserId;
    if(request.body.from === 'admin') {
        check = await Form.find({ admin: true });
        console.log('CHECKING ADMIN', check);
    } else if(request.body.from === 'checklogin') {
        // Done at the beginning of a page refresh
        // Check if logged in and if the saved browserId is the same to the saved to session
        browserId = request.body.browserId;
        if(checkIfLoggedIn(request.session) && browserId === request.session.browserId) {
            result.username = request.session.username;
        } else {
            request.session.browserId = browserId;
        }
    } else if(request.body.from === 'getCSRF') {
        if(!request.session) {
            result.sessionExpired = true;
        } else if(request.body.browserId && request.body.browserId === request.session.browserId) {
            const timestamp = + new Date();
            request.session.csrfSecret = timestamp + '-' + createRandomString(24);
            result.csrfToken = request.csrfToken();
        } else {
            logger.log('Trying to getCSRF at /login/access but browserId is either invalid or missing. (+ sess, body)', request.session, request.body);
        }
    } else if(request.body.from === 'logout') {
        if(request.session.username) {
            request.session.destroy();
            if(request.cookies['connect.sid']) {
                response.clearCookie('connect.sid');
            }
        }
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

    if(!checkIfLoggedIn(request.session)) {
        result.loggedIn = false;
    } else {
        result.loggedIn = true;
    }
    
    return response.json(result);
});

loginRouter.post('/', async (request, response) => {

    const body = request.body;

    // Check user
    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);
    const browserId = body.browserId;

    if(!(user && passwordCorrect && browserId && browserId.length == 32)) {
        // Login counter here and create a cool down period for x wrong logins
        return response.status(401).json({
            error: 'invalid username and/or password',
            loggedIn: false,
        });
    }

    // Check form
    const form = await Form.findOne({ formId: body.id });
    if(!form) {
        logger.error(`Could not find login form '${body.id}'.`);
        return response.status(500).json({
            error: 'form missing or invalid',
            loggedIn: false,
        });
    } else {
        if(form.editorOptions && form.editorOptions.loginAccessLevel
            && user.userLevel < form.editorOptions.loginAccessLevel.value) {
            logger.log(`User level is too small to log in from '${body.id}'. Current requirement is '${form.editorOptions.loginAccessLevel.value}' while the user has '${user.userLevel}'.`, user._id);
            return response.status(401).json({
                error: 'invalid username and/or password',
                loggedIn: false,
            });
        }
    }


    // Create a new session:
    request.session.username = user.username;
    request.session.userLevel = user.userLevel;
    request.session._id = user._id;
    request.session.browserId = body.browserId;
    request.session.loggedIn = true;
    if(body['remember-me']) {
        request.session.cookie.maxAge = 864000000; // 10 days
    } else {
        request.session.cookie.maxAge = 3600000; // 1 hour
    }

    response
        .status(200)
        .send({
            loggedIn: true,
            username: user.username,
        });
});

module.exports = loginRouter;