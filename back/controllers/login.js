const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('./../models/user');
const Form = require('./../models/form');
const logger = require('./../utils/logger');
const { checkAccess, checkIfLoggedIn } = require('../utils/checkAccess');
const { createRandomString } = require('../../shared/parsers');
const { getSetting, getSettings } = require('../utils/settingsService');

loginRouter.post('/access', async (request, response) => {

    const result = {};
    let check, browserId;
    if(request.body.from === 'admin') {
        // Get the requester's useRightsLevel and editorRightsLevel matching formIds
        let userLevel = 0;
        if(request.session && request.session.userLevel) userLevel = request.session.userLevel;
        check = await Form.find({
            useRightsLevel: { $lte: userLevel },
            editorRightsLevel: { $lte: userLevel }
        });
        result.useRights = check
            .filter(form => form.useRightsLevel <= userLevel)
            .map(form => form.formId);
        result.editorRights = check
            .filter(form => form.editorRightsLevel <= userLevel)
            .map(form => form.formId);
    } else if(request.body.from === 'checklogin') {
        // Done at the beginning of a page refresh
        // Check if logged in and if the saved browserId is the same as the one saved in the session
        browserId = request.body.browserId;
        if(checkIfLoggedIn(request.session) && browserId === request.session.browserId) {
            result.username = request.session.username;
            result.userLevel = request.session.userLevel || 0;
        } else {
            request.session.browserId = browserId;
        }
        result.serviceSettings = await getSettings(request);
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
            const id = ids[i];
            if(id.from === 'universe') {
                // TODO, do universe here (find by universeId)
            } else { // Default is Form
                check = await Form.findOne({ formId: id.id });
            }
            const settings = await getSettings(request, true);
            result[id.id] = checkAccess(request, check, settings);
        }
    }

    result.loggedIn = checkIfLoggedIn(request.session);
    
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
    let sessionAge;
    const settings = getSettings(request);
    if(body['remember-me']) {
        request.session.cookie.maxAge = 864000000; // 10 days in milliseconds
    } else {
        sessionAge = await getSetting(request, 'session-age', true, true);
        if(!sessionAge || sessionAge < 300) sessionAge = 300; // Minimum 5 minutes
        request.session.cookie.maxAge = sessionAge * 1000; // Milliseconds
    }

    response
        .status(200)
        .send({
            loggedIn: true,
            username: user.username,
            userLevel: user.userLevel,
            settings,
        });
});

module.exports = loginRouter;