const CONFIG = require('./../../CONFIG').USER;

const loginBeaconFormData = {
    formId: 'beacon-main-login',
    path: '/api/login',
    method: 'POST',
    type: 'form',
    useRightsLevel: 0,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    editorOptions: {
        loginAccessLevel: {
            labelId: 'login_access_level',
            type: 'select-user-level',
            value: 2,
        },
    },
    form: {
        onErrorMsgId: 'login_error_empty',
        submitButton: {
            id: 'submit-button',
            labelId: 'login',
        },
        submitFields: ['username', 'password'],
        fieldsets: [
            {
                type: 'textinput',
                id: 'username',
                labelId: 'username',
                required: true,
                maxLength: 32,
            },
            {
                type: 'textinput',
                id: 'password',
                labelId: 'password',
                required: true,
                maxLength: 64,
                password: true,
            },
            {
                type: 'checkbox',
                id: 'remember-me',
                labelId: 'remember_me',
            },
            { type: 'divider' },
        ],
    },
};

module.exports = loginBeaconFormData;