const formsRouter = require('express').Router();
const logger = require('./../utils/logger');
const Form = require('./../models/form');
const User = require('./../models/user');
const { validatePrivileges } = require('./forms/formEngine');

// Get all forms
formsRouter.get('/', async (request, response) => {

    // TODO: needs access right check, but for now, this is good for debugging
    const result = await Form.find({});
    response.json(result);
});

// Get form by id
formsRouter.get('/:id', async (request, response) => {
    
    let formId, splitId = [];
    const id = request.params.id;
    if(id.includes('+')) {
        splitId = id.split('+');
        formId = splitId[0];
    } else {
        formId = id;
    }
    let result = await Form.findOne({ formId });
    if(!result) {
        logger.log(`Could not find form with id '${formId}'.`);
        return response.status(404).json({ msg: 'Could not find form.', id: formId });
    }
    const error = await validatePrivileges(result, request);
    if(error) {
        return response.status(error.code).json(error.obj);
    }
    
    const form = result.form;
    form.id = result.formId;
    form.api = result.path;
    form.method = result.method;

    if(splitId.length) {
        form.data = await getAdditionalData(formId, splitId[1], request.session.userLevel);
        if(form.data._error) {
            logger.log(`Error with additional form data. FormId: '${formId}'. Additional Id: '${splitId[1]}'. (+ form.data._error)`, form.data._error);
            return response.status(form.data._error.code).json(form.data._error.obj);
        }
    }
    
    response.json(form);
});

const getAdditionalData = async (formId, dataId, userLevel) => {
    if(formId === 'edit-user-form') {
        const user = User.findById(dataId);
        if(!user) {
            return {
                _error: { code: 404,
                    obj: {
                        msg: 'Could not find user.',
                        userNotFound: true,
                    },
                },
            };
        } else if(user.userLevel >= userLevel) {
            return {
                _error: { code: 401,
                    obj: {
                        msg: 'Not authorised to edit user.',
                        userLevelError: true,
                    },
                },
            };
        }
        return user;
    } else {
        return {
            _error: { code: 400,
                obj: {
                    msg: 'This is still WIP / TODO.',
                    wipError: true,
                },
            },
        };
    }
};

module.exports = formsRouter;