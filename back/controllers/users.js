const bcrypt = require('bcrypt');
const { isValidObjectId, createNewEditedArray } = require('./../utils/helpers');
const usersRouter = require('express').Router();
const CONFIG = require('./../shared').CONFIG;
const readUsersFormData = require('./../../shared/formData/readUsersFormData');
const readOneUserFormData = require('./../../shared/formData/readOneUserFormData');
const readProfileFormData = require('./../../shared/formData/readProfileFormData');
const editExposeProfileFormData = require('./../../shared/formData/editExposeProfileFormData');
const logger = require('./../utils/logger');
const User = require('./../models/user');
const UserSetting = require('./../models/userSetting');
const AdminSetting = require('./../models/adminSetting');
const Form = require('./../models/form');
const { getAndValidateForm, getUserExposure } = require('./forms/formEngine');
const { checkIfLoggedIn } = require('./../utils/checkAccess');
const { sendEmailById } = require('../utils/emailService');
const { createRandomString } = require('../../shared/parsers');


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

    // Exposure check
    const requesterUserLevel = request.session.userLevel || 0;
    let publishUser = {};
    const exposures = await getUserExposure(userToView);
    const formData = await Form.findOne({ formId });
    if(requesterUserLevel >= formData.editorRightsLevel) {
        // Viewer is an admin show all info
        publishUser = userToView;
        publishUser.exposure = exposures;
    } else {
        const exposureKeys = Object.keys(exposures);
        for(let i=0; i<exposureKeys.length; i++) {
            const key = exposureKeys[i];
            if(exposures[key] === 0 || (exposures[key] === 1 && requesterUserLevel > 0)) {
                if(key.includes('_')) {
                    // Deep object
                    const parts = key.split('_');
                    let value = userToView[parts[0]];
                    let path = {};
                    path[parts[0]] = {};
                    for(let p=1; p<parts.length; p++) {
                        value = value[parts[p]];
                        // This is sort of hard coded and should be improved (supports now x levels of nesting in the object)
                        const isTheEnd = p === parts.length - 1;
                        if(p === 1 && isTheEnd) {
                            publishUser[parts[0]] = {};
                            publishUser[parts[0]][parts[1]] = value;
                            break;
                        }
                        if(p === 2 && isTheEnd) {
                            publishUser[parts[0]] = {}; publishUser[parts[0]][parts[1]] = {};
                            publishUser[parts[0]][parts[1]][parts[2]] = value;
                            break;
                        }
                        if(p === 3 && isTheEnd) {
                            publishUser[parts[0]] = {}; publishUser[parts[0]][parts[1]] = {}; publishUser[parts[0]][parts[1]][parts[2]] = {};
                            publishUser[parts[0]][parts[1]][parts[2]][parts[3]] = value;
                            break;
                        }
                        if(p === 4 && isTheEnd) {
                            publishUser[parts[0]] = {}; publishUser[parts[0]][parts[1]] = {}; publishUser[parts[0]][parts[1]][parts[2]] = {}; publishUser[parts[0]][parts[1]][parts[2]][parts[3]] = {};
                            publishUser[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]] = value;
                            break;
                        }
                        if(p === 5 && isTheEnd) {
                            publishUser[parts[0]] = {}; publishUser[parts[0]][parts[1]] = {}; publishUser[parts[0]][parts[1]][parts[2]] = {}; publishUser[parts[0]][parts[1]][parts[2]][parts[3]] = {}; publishUser[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]] = {};
                            publishUser[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]][parts[5]] = value;
                            break;
                        }
                    }
                    continue;
                }
                // First level object
                publishUser[key] = userToView[key];
            }
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
            msg: 'User not authorised.',
        });
        return;
    } else if(body.userLevel < 1) {
        logger.log('Trying to save userLevel lower than 1. (+ user to update level, session)', body.userLevel, request.session);
        response.status(400).json({
            badRequest: true,
            msg: 'Bad request.',
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
    let userLevel = formData.editorOptions && formData.editorOptions.newUserLevel
        ? formData.editorOptions.newUserLevel.value || 1
        : 1;
    
    let createdBy = null;
    if(checkIfLoggedIn(request.session)) createdBy = request.session._id;
    
    if(userCount.length === 0) { // First registration is always for a super admin (level 9)
        userLevel = 9; // Create admin user
        logger.log(`Created a super user (level: ${userLevel}) (public form).`);
    } else {
        logger.log(`Created a level ${userLevel} user. (${createdBy ? 'creator: '+createdBy : 'public form'})`);
    }

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

    if(!savedUser) {
        logger.error('Could not save new user.');
        response.status(500).json({
            msg: 'Internal error. Server Could not save new user.',
            internalError: true,
        });
        return;
    }

    if(savedUser.email) {
        const mail = await sendEmailById('new-user-email', {
            to: savedUser.email,
            username: savedUser.username,
        }, request);
        if(!mail.emailSent) {
            logger.error(`Could not send email for userId: ${savedUser._id}.`);
        }
    }

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
            msg: 'User was not found. It has propably been deleted.',
            userNotFoundError: true,
        });
        return;
    }

    const exposures = await getUserExposure(userToView);
    userToView.exposure = exposures;
    
    response.json(userToView);
});


// Edit own profile
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
        response.json({
            msg: 'Bad request.',
            badRequest: true,
        });
        return;
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

// Edit exposure values
usersRouter.put('/user/exposure', async (request, response) => {
    
    const body = request.body;
    let userId = request.session._id;
    let editingOwnProfile = true;
    if(body.userId && body.userId !== userId) {
        userId = body.userId;
        editingOwnProfile = false;
        delete body.userId;
    }
    const user = await User.findById(userId);
    
    if(editingOwnProfile) {
        const userCanExpose = await AdminSetting.findOne({ settingId: 'users-can-set-exposure-levels' });
        if(userCanExpose.value !== 'true') {
            response.status(401).json({
                msg: 'Unauthorised. Users cannot set exposure levels.',
                unauthorised: true,
            });
            return;
        }
    }

    const error = await getAndValidateForm(body.id, 'PUT', request);
    if(error) {
        response.status(error.code).json(error.obj);
        return;
    }

    const exposure = {};
    const exposureFormId = editExposeProfileFormData.formId;
    const exposureFormData = await Form.findOne({ formId: exposureFormId });
    if(!editingOwnProfile && exposureFormData.editorRightsLevel > request.session.userLevel) {
        logger.error('Could not update user\'s own profile exposure. Editor\'s user level is too low. (+ editorId, required level)', request.session._id, exposureFormData.editorRightsLevel);
        response.status(401).json({
            msg: 'Unauthorised.',
            unauthorised: true,
        });
        return;
    }
    const showToUsers = exposureFormData.editorOptions.showToUsers;
    const fieldsets = exposureFormData.form.fieldsets;
    for(let i=0; i<fieldsets.length; i++) {
        const fs = fieldsets[i];
        for(let j=0; j<fs.fields.length; j++) {
            const field = fs.fields[j];
            if(body[field.id] !== undefined && !field.disabled && showToUsers[field.id].value) {
                exposure[field.id] = body[field.id];
            }
        }
    }

    let updatedUser = {};
    if(Object.keys(exposure).length) {
        const edited = await createNewEditedArray(user.edited, request.session._id);
        updatedUser = {
            exposure,
            edited,
        };
    } else {
        response.status(400).json({
            msg: 'Bad request. No valid fields to update were found.',
            noFieldsFound: true,
        });
        return;
    }

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if(!savedUser) {
        logger.error('Could not update user\'s own profile exposure. User was not found (id: ' + userId + ').');
        response.status(404).json({
            msg: 'User to update was not found.',
            userNotFoundError: true,
        });
        return;
    }

    return response.json(savedUser);
});

// Delete own profile
usersRouter.post('/own/delete', async (request, response) => {
    const body = request.body;
    const userId = request.session._id;
    const user = await User.findById(userId);
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);
    if(!passwordCorrect) {
        return response.status(401).json({
            error: 'invalid password',
            loggedIn: true,
        });
    }

    // Superadmin cannot be self-deleted
    if(request.session.userLevel === 9) {
        return response.status(403).json({
            error: 'unauthorised',
            loggedIn: true,
        });
    }

    // Delete the user
    User.findByIdAndRemove(userId, (err) => {
        if(err) {
            logger.error('Could not self delete profile. (+ userId, err)', userId, err);
            return response.status(500).json({
                error: 'db error',
                dbError: true,
            });
        }
        return response.json({ userDeleted: true });
    });
});

// Change password
usersRouter.post('/own/changepass', async (request, response) => {
    const body = request.body;
    const userId = request.session._id;
    const user = await User.findById(userId);
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.curPassword, user.passwordHash);
    if(!passwordCorrect) {
        return response.status(401).json({
            error: 'invalid password',
            loggedIn: true,
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const edited = await createNewEditedArray(user.edited, request.session._id);
    const updatedUser = {
        passwordHash,
        edited,
    };

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if(!savedUser) {
        logger.error('Could not update user\'s password. User was not found (id: ' + userId + ').');
        response.status(404).json({
            msg: 'User to update was not found.',
            userNotFoundError: true,
        });
        return;
    }

    return response.json(savedUser);
});

// Request a new password link
usersRouter.post('/newpassrequest', async (request, response) => {
    
    // Check the admin setting for toggling forgot password feature here

    const body = request.body;
    const email = body.email;

    const user = await User.findOne({ email: email.trim() });
    if(user) {
        // Check if email has been already sent
        const coolDownTime = 1000 * 30; // in ms
        const timeNow = new Date();
        if(user.security && user.security.newPassLink && user.security.newPassLink.sent) {
            const lastSent = new Date(user.security.newPassLink.sent);
            if(timeNow.getTime() > lastSent.getTime() + coolDownTime) {
                return response.json({ tryingToSend: true });
            }
        }

        const newToken = createRandomString(64, true);
        console.log('newToken2', newToken);

        // Send email here

    }

    return response.json({ tryingToSend: true });
});

module.exports = usersRouter;