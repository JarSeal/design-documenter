const formsRouter = require('express').Router();
const bcrypt = require('bcrypt');
const CONFIG = require('./../shared').CONFIG.USER;
const logger = require('./../utils/logger');
const Form = require('./../models/form');
const User = require('./../models/user');
const { validateField, validateKeys } = require('./forms/formValidator');
const newUserFormData = require('./../shared').newUserFormData;
const newUniverseFormData = require('./../shared').newUniverseFormData;

// Get all forms
formsRouter.get('/', async (request, response) => {
    let result = await Form.find({});
    if(result.length < presetForms.length) {
        // Create missing forms
        for(let i=0; i<presetForms.length; i++) {
            result = await Form.findOne({ formId: presetForms[i] });
            if(!result) await _createPresetForm(presetForms[i]);
        }
        result = await Form.find({});
    }
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    const formId = request.params.id;
    let result = await Form.findOne({ formId });

    if(!result) {
        result = await _createPresetForm(formId);
    }

    if(!result) {
        response.status(404).json({ msg: 'Could not find form.', id: formId });
    } else {
        response.json(result.form);
    }
});

// Create a new form
formsRouter.post('/', async (request, response) => {
    request, response;
    // TODO
    response.json({ msg: 'not implemented' });
});

// Send a filled form
formsRouter.post('/filled', async (request, response) => {
    const body = request.body;
    const formData = await Form.findOne({ formId: body.id });
    if(!formData || !formData.form) {
        response.status(404).json({ msg: 'Could not find form (' + body.id + '),' });
        return;
    }

    const keys = Object.keys(body);
    const keysFound = validateKeys(formData.form, keys);
    if(!keysFound) {
        response.status(400).json({ msg: 'Bad request. Payload missing or incomplete.' });
        return;
    }

    const errors = {};
    for(let i=0; i<keys.length; i++) {
        // Payload contains extra/undefined keys or no keys at all
        let error = validateField(formData.form, keys[i], body[keys[i]]); // TODO: FIX THIS!!! PASSWORD IS NOT CHECKED
        if(error) errors[keys[i]] = error;
    }
    const errorKeys = Object.keys(errors);
    if(errorKeys.length) {
        response.status(400).json({ msg: 'Bad request. Validation errors.', errors });
        return;
    }

    if(body.id === 'new-user-form') {
        // Special case for registering a new user
        const newUser = await _createUser(body);
        response.json(newUser);
        return;
    } else if(body.id === 'new-universe-form') {
        // Special case for creating a new universe
        response.json({ msg: 'not implemented' });
        return;
    }
    
    response.json({ msg: 'filledForm' }); // TODO, save general forms here as universes, structures, beacons, or datasets
});

const _createUser = async (body) => {

    const findUsername = await User.findOne({ username: body.username.trim() });
    if(findUsername) {
        return {
            msg: 'Bad request. Validation errors.',
            errors: { username: 'username_taken' },
        };
    }
    if(CONFIG.email.required) {
        const findEmail = await User.findOne({ email: body.email.trim() });
        if(findEmail) {
            return {
                msg: 'Bad request. Validation errors.',
                errors: { email: 'email_taken' },
            };
        }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const userCount = await User.find().limit(1);
    let userLevel = 1; // Create regular user
    if(userCount.length === 0) {
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

    return savedUser;
};

const presetForms = ['new-user-form', 'new-universe-form'];
const _createPresetForm = async (id) => {
    let newForm, form;
    if(id === 'new-user-form') {
        form = {
            formId: id,
            form: newUserFormData,
            created: {
                by: null,
                autoCreated: true,
                date: new Date(),
            },
        };
        newForm = new Form(form);
        await newForm.save();
        logger.log(`Preset form '${id}' auto-created.`);
        return form;
    } else if(id === 'new-universe-form') {
        form = {
            formId: id,
            form: newUniverseFormData,
            created: {
                by: null,
                autoCreated: true,
                date: new Date(),
            },
        };
        newForm = new Form(form);
        await newForm.save();
        logger.log(`Preset form '${id}' auto-created.`);
        return form;
    } else {
        return null;
    }
};

module.exports = formsRouter;