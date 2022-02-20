const bcrypt = require('bcrypt');
const { isValidObjectId, createNewEditedArray } = require('./../utils/helpers');
const usersRouter = require('express').Router();
const CONFIG = require('./../shared').CONFIG;
const readUsersFormData = require('./../../shared/formData/readUsersFormData');
const readOneUserFormData = require('./../../shared/formData/readOneUserFormData');
const readProfileFormData = require('./../../shared/formData/readProfileFormData');
const editUserFormData = require('./../../shared/formData/editUserFormData');
const logger = require('./../utils/logger');
const User = require('./../models/user');
const UserSetting = require('./../models/userSetting');
const Form = require('./../models/form');
const { getAndValidateForm } = require('./forms/formEngine');
const { checkIfLoggedIn } = require('./../utils/checkAccess');
const editExposeProfileFormData = require('../../shared/formData/editExposeProfileFormData');


// Get all users (for admins)
usersRouter.get('/', async (request, response) => {

    // Get formData, get user, and check the user's admin rights
    const formId = readUsersFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    // Get the users that have smaller user level than the current user
    const result = await User.find({ userLevel: { $lt: parseInt(request.session.userLevel) } });

    // const result = await User.find({}).populate('userGroups', {
    //     name: 1, id: 1
    // });
    response.json(result);
});


// Get one user
usersRouter.get('/:userId', async (request, response) => {

    const formId = readOneUserFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const userId = request.params.userId;
    let userToView = await User.findOne({ username: userId })
        .populate('edited.by', { username: 1 })
        .populate('created.by', { username: 1 });
    if(!userToView) {
        if(isValidObjectId(userId)) {
            userToView = await User.findById(userId)
                .populate('edited.by', { username: 1 })
                .populate('created.by', { username: 1 });
        }
    }

    if(!userToView) {
        logger.log('Could not find user with this id: ' + userId + ' (+ session)', request.session);
        response.status(404).json({
            msg: 'User was not found.',
            userNotFoundError: true,
        });
        return;
    }

    // Check what userLevel users can view this profile
    let readRightLevels = {};
    if(userToView.security && userToView.security.readRightLevels) {
        readRightLevels = userToView.security.readRightLevels;
    } else {
        const formData = await Form.findOne({ formId });
        readRightLevels = formData.editorOptions && formData.editorOptions.readRightLevels
            ? formData.editorOptions.readRightLevels
            : {};
    }
    const keys = Object.keys(readRightLevels);
    const requesterUserLevel = request.session.userLevel || 0;
    const publishUser = {};
    for(let i=0; i<keys.length; i++) {
        if(requesterUserLevel >= readRightLevels[keys[i]].value) {
            publishUser[keys[i]] = userToView[keys[i]];
        }
    }

    // For security reasons, show 404 even if the user exists
    if(Object.keys(publishUser).length === 0) {
        logger.log('Unauthorised. Not high enough userLevel to view current user (all fields were above the requester userLevel). Returning 404 for security reasons. (+ session, userId)', request.session, userId);
        response.status(404).json({
            msg: 'User was not found.',
            userNotFoundError: true,
        });
        return;
    }

    // Check if current user can edit this user
    const editUserFormId = editUserFormData.formId;
    const editUFormData = await Form.findOne({ formId: editUserFormId });
    if(requesterUserLevel >= editUFormData.useRightsLevel) {
        publishUser.id = userToView._id;
    }
    
    response.json(publishUser);
});


// Edit user
usersRouter.put('/', async (request, response) => {

    const body = request.body;
    const error = await getAndValidateForm(body.id, 'PUT', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    if(CONFIG.USER.email.required) {
        const findEmail = await User.findOne({ email: body.email.trim() });
        if(findEmail && String(findEmail.id) !== body.userId) {
            response.json({
                msg: 'Bad request. Validation errors.',
                errors: { email: 'email_taken' },
                emailTaken: true,
            });
            return;
        }
    }

    // Validate userLevel
    const curLevel = request.session.userLevel;
    if(body.userLevel >= curLevel) {
        logger.log('Unauthorised. Not high enough userLevel. (+ user to update level, session)', body.userLevel, request.session);
        response.status(401).json({
            unauthorised: true,
            msg: 'User not authorised.'
        });
        return;
    } else if(body.userLevel < 1) {
        logger.log('Trying to save userLevel lower than 1. (+ user to update level, session)', body.userLevel, request.session);
        response.status(400).json({
            badRequest: true,
            msg: 'Bad request.'
        });
        return;
    }

    const user = await User.findById(body.userId);
    const edited = await createNewEditedArray(user.edited, request.session._id);

    const updatedUser = {
        email: body.email.trim(),
        name: body.name.trim(),
        userLevel: parseInt(body.userLevel),
        edited,
    };

    const savedUser = await User.findByIdAndUpdate(body.userId, updatedUser, { new: true });
    if(!savedUser) {
        logger.log('Could not update user. User was not found (id: ' + body.userId + ').');
        response.status(404).json({
            msg: 'User to update was not found. It has propably been deleted by another user.',
            userNotFoundError: true,
        });
        return;
    }
    response.json(savedUser);
});


// Delete users
usersRouter.post('/delete', async (request, response) => {
    
    const body = request.body;
    const error = await getAndValidateForm(body.id, 'POST', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    // Check if the user being deleted exists and
    // that the user deleting has a higher userLevel
    // than the user about to be deleted
    const users = body.users;
    const usernames = [];
    const errors = [];
    for(let i=0; i<users.length; i++) {
        const user = await User.findById(users[i]);
        if(!user) {
            logger.log('Could not find user to delete (id: ' + users[i] + ').');
            errors.push({
                userId: users[i],
                userNotFoundError: true,
                errorMsg: 'User not found.',
            });
            continue;
        } else if(user.userLevel >= request.session.userLevel) {
            logger.log('Could not delete user (id: ' + users[i] + '). Not high enough userLevel. (+ user.userLevel)', user.userLevel);
            errors.push({
                userId: users[i],
                notAllowedToDeleteUserError: true,
                errorMsg: 'Not allowed to delete user (userLevel lower or same than user being deleted).',
            });
            continue;
        }
        await User.findByIdAndRemove(users[i], (err, data) => {
            if(err) {
                logger.error('Error while trying to delete a user (id: ' + users[i] + '). (+ error)', error);
                errors.push({
                    error,
                    dbError: true,
                    user,
                });
            } else {
                if(data && data.username) {
                    usernames.push(data.username);
                }
            }
        });
        const settings = await UserSetting.find({ userId: users[i] });
        for(let j=0; j<settings.length; j++) {
            await UserSetting.findByIdAndRemove(settings[j]._id, (err) => {
                if(err) {
                    logger.error('Error while trying to delete a user setting (user id: ' + users[i] + ', setting id: ' + settings[j]._id + '). (+ error)', error);
                    errors.push({
                        error,
                        dbError: true,
                        user,
                    });
                }
            });
        }
    }

    const responseObject = {
        deletionResponse: true,
        allDeleted: !errors.length,
        deleted: usernames,
    };
    if(errors.length) responseObject.errors = errors;
    response.json(responseObject);
});


// Register user
usersRouter.post('/', async (request, response) => {

    const body = request.body;
    const error = await getAndValidateForm(body.id, 'POST', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const findUsername = await User.findOne({ username: body.username.trim() });
    if(findUsername) {
        response.json({
            msg: 'Bad request. Validation errors.',
            errors: { username: 'username_taken' },
            usernameTaken: true,
        });
        return;
    }
    if(CONFIG.USER.email.required) {
        const findEmail = await User.findOne({ email: body.email.trim() });
        if(findEmail) {
            response.json({
                msg: 'Bad request. Validation errors.',
                errors: { email: 'email_taken' },
                emailTaken: true,
            });
            return;
        }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const userCount = await User.find({}).limit(1);
    const formData = await Form.findOne({ formId: body.id });
    let userLevel = formData.form.server && formData.form.server.newUserLevel
        ? formData.form.server.newUserLevel
        : 1;
    if(userCount.length === 0) { // First registration is always for a super admin (level 9)
        userLevel = 9; // Create admin user
        logger.log(`Created a super user (level: ${userLevel}).`);
    } else {
        logger.log(`Created a level ${userLevel} user.`);
    }

    let createdBy = null;
    if(checkIfLoggedIn(request.session)) createdBy = request.session._id;

    const user = new User({
        username: body.username.trim(),
        email: body.email.trim(),
        name: body.name.trim(),
        userLevel,
        passwordHash,
        created: {
            by: createdBy,
            publicForm: createdBy ? false : true,
            date: new Date(),
        },
    });

    const savedUser = await user.save();

    response.json(savedUser);
});


// Read own profile
usersRouter.get('/own/profile', async (request, response) => {

    const formId = readProfileFormData.formId;
    const error = await getAndValidateForm(formId, 'GET', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const userId = request.session._id;
    let userToView = await User.findById(userId)
        .populate('edited.by', { username: 1 })
        .populate('created.by', { username: 1 });

    if(!userToView) {
        logger.log('Could not find user with this id: ' + userId + ' (+ session)', request.session);
        response.status(404).json({
            msg: 'User was not found. It has propably been deleteds.',
            userNotFoundError: true,
        });
        return;
    }
    
    // Get exposure data for fields
    const exposureFormId = editExposeProfileFormData.formId;
    const defaultExposures = await Form.find({ formId: exposureFormId });
    const fieldsets = defaultExposures[0].form.fieldsets;
    for(let i=0; i<fieldsets.length; i++) {
        const fields = fieldsets[i].fields;
        for(let j=0; j<fields.length; j++) {
            if(fields[j].type === 'divider') continue;
            const fieldId = fields[j].id;
            if(!userToView.exposure || !userToView.exposure[fieldId]) {
                userToView.exposure[fieldId] = fields[j].defaultValue;
            }
        }
    }
    
    response.json(userToView);
});


// Edit profile
usersRouter.put('/own/profile', async (request, response) => {
    
    const body = request.body;
    const userId = request.session._id;
    const error = await getAndValidateForm(body.id, 'PUT', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    if(CONFIG.USER.email.required) {
        const findEmail = await User.findOne({ email: body.email.trim() });
        if(findEmail && String(findEmail._id) !== userId) {
            response.json({
                msg: 'Bad request. Validation errors.',
                errors: { email: 'email_taken' },
                emailTaken: true,
            });
            return;
        }
    }

    const user = await User.findById(userId);

    // Check if the session user is the same as target
    if(!user || user.username !== request.session.username) {
        logger.error('Could not update user\'s own profile. User was not found or does not match the session user (id: ' + body.userId + ').');
    }

    const edited = await createNewEditedArray(user.edited, userId);
    const updatedUser = {
        email: body.email.trim(),
        name: body.name.trim(),
        edited,
    };

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if(!savedUser) {
        logger.error('Could not update user\'s own profile. User was not found (id: ' + userId + ').');
        response.status(404).json({
            msg: 'User to update was not found. It has propably been deleted by another user.',
            userNotFoundError: true,
        });
        return;
    }
    response.json(savedUser);
});

module.exports = usersRouter;