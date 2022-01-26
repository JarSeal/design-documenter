const CONFIG = require('./../../CONFIG').USER;

const adminSettingsFormData = {
    formId: 'admin-settings-form',
    path: '/api/settings/admin',
    method: 'PUT',
    type: 'form',
    useRightsLevel: 8,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 9,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsg: '',
        afterSubmitShowOnlyMsg: true,
        singleEdit: true,
        submitButton: {
            id: 'submit-admin-settings-button-id',
            labelId: 'save',
            class: 'save-button',
        },
        submitFields: [
            'max-login-attempts', 'login-cooldown-time', 'session-age', 'public-user-registration',
        ],
        fieldsets: [
            {
                // FIELDSET
                id: 'admin-settings-login-fs',
                fieldsetTitleId: 'login',
                fields: [
                    {
                        // Max login attempts
                        type: 'textinput',
                        id: 'max-login-attempts',
                        labelId: 'max_login_attempts',
                        descriptionId: 'max_login_attempts_desc',
                        defaultValue: 5,
                        required: true,
                        regex: '[0-9]+$',
                        settingType: 'integer',
                        settingReadRight: 0, // Defaults to 0
                    },
                    {
                        // Login cooldown time
                        type: 'textinput',
                        id: 'login-cooldown-time',
                        labelId: 'login_cooldown_time',
                        descriptionId: 'login_cooldown_time_desc',
                        defaultValue: 15,
                        required: true,
                        settingType: 'integer',
                        regex: '[0-9]+$',
                    },
                ],
            },
            {
                // Session
                id: 'admin-settings-session-fs',
                fieldsetTitleId: 'session',
                fields: [
                    {
                        // Session age
                        type: 'textinput',
                        id: 'session-age',
                        labelId: 'session_age',
                        descriptionId: 'session_age_desc',
                        defaultValue: 600,
                        required: true,
                        settingType: 'integer',
                        regex: '[0-9]+$',
                    },
                ],
            },
            {
                // Registration
                id: 'admin-settings-registration-fs',
                fieldsetTitleId: 'registration',
                fields: [
                    {
                        // Public registration
                        type: 'checkbox',
                        id: 'public-user-registration',
                        labelId: 'public_user_registration',
                        descriptionId: 'public_user_registration_desc',
                        defaultValue: true,
                        settingType: 'boolean',
                    },
                ],
            },
        ],
    },
};

module.exports = adminSettingsFormData;