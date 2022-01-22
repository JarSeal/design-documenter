const bcrypt = require('bcrypt');
const isValidObjectId = require('./../utils/helpers').isValidObjectId;
const usersRouter = require('express').Router();
const CONFIG = require('./../shared').CONFIG;
const readUsersFormData = require('./../../shared/formData/readUsersFormData');
const readOneUserFormData = require('./../../shared/formData/readOneUserFormData');
const logger = require('./../utils/logger');
const User = require('./../models/user');
const Form = require('./../models/form');
const { createNewEditedArray, getAndValidateForm } = require('./forms/formEngine');


// Get all users (for admins)
usersRouter.get('/', async (request, response) => {

    // Get formData, get user, and check the user's admin rights
    const formId = readUsersFormData.formId;
    const user = await User.findById(request.session._id);
    const error = await getAndValidateForm(formId, 'GET', request, user);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }
    
    // Get the users that have smaller user level than the current user
    const result = await User.find({ userLevel: { $lt: parseInt(user.userLevel) } });

    // const result = await User.find({}).populate('userGroups', {
    //     name: 1, id: 1
    // });
    response.json(result);
});


// Get one user
usersRouter.get('/:userId', async (request, response) => {

    const formId = readOneUserFormData.formId;
    const user = await User.findById(request.session._id);
    const error = await getAndValidateForm(formId, 'GET', request, user);
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
            msg: 'User was not found. It has propably been deleted.',
            userNotFoundError: true,
        });
        return;
    } else if(userToView.userLevel >= user.userLevel) {
        logger.log('Unauthorised. Not high enough userLevel to view current user. (+ session, userId)', request.session, userId);
        response.status(401).json({
            unauthorised: true,
            msg: 'User not authorised.'
        });
        return;
    }
    
    response.json(userToView);
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
        if(findEmail && findEmail.id !== body.userId) {
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

    const edited = await createNewEditedArray(body.userId, request.session._id);

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

    const user = new User({
        username: body.username.trim(),
        email: body.email.trim(),
        name: body.name.trim(),
        userLevel,
        passwordHash,
        created: {
            by: null,
            publicForm: true,
            date: new Date(),
        },
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

module.exports = usersRouter;