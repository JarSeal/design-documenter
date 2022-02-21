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
            'user-registration-level', 'user-level-required-to-register', 'max-login-logs', 'max-edited-logs',
            'users-can-set-exposure-levels', 'use-users-exposure-levels',
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
                        defaultValue: 60, // one hour
                        required: true,
                        settingType: 'integer',
                        regex: '[0-9]+$',
                    },
                    {
                        // 'Remember me' session age
                        type: 'textinput',
                        id: 'remember-me-session-age',
                        labelId: 'remember_me_session_age',
                        descriptionId: 'remember_me_session_age_desc',
                        defaultValue: 10080, // 7 days
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
                    {
                        // User level required to register new users
                        type: 'dropdown',
                        id: 'user-level-required-to-register',
                        labelId: 'user_level_required_to_register',
                        descriptionId: 'user_level_required_to_register_desc',
                        defaultValue: 8,
                        settingType: 'integer',
                        getOptionsFn: 'userLevelsWithNine',
                        minValue: 1,
                        maxValue: 9,
                    },
                ],
            },
            {
                // Logs
                id: 'admin-settings-logs-fs',
                fieldsetTitleId: 'logs',
                fields: [
                    {
                        // Max login logs
                        type: 'textinput',
                        id: 'max-login-logs',
                        labelId: 'max_login_logs',
                        descriptionId: 'max_login_logs_desc',
                        defaultValue: 10,
                        required: true,
                        settingType: 'integer',
                        regex: '[0-9]+$',
                    },
                    {
                        // Max edited logs
                        type: 'textinput',
                        id: 'max-edited-logs',
                        labelId: 'max_edited_logs',
                        descriptionId: 'max_edited_logs_desc',
                        defaultValue: 10,
                        required: true,
                        settingType: 'integer',
                        regex: '[0-9]+$',
                    },
                ],
            },
            {
                // User Profiles
                id: 'admin-settings-user-profiles-fs',
                fieldsetTitleId: 'user_profiles',
                fields: [
                    {
                        // Users' can set exposure levels
                        type: 'checkbox',
                        id: 'users-can-set-exposure-levels',
                        labelId: 'users_can_set_exposure_levels',
                        descriptionId: 'users_can_set_exposure_levels_desc',
                        defaultValue: true,
                        settingType: 'boolean',
                    },
                    {
                        // Use users' own expose data
                        type: 'checkbox',
                        id: 'use-users-exposure-levels',
                        labelId: 'use_users_exposure_levels',
                        descriptionId: 'use_users_exposure_levels_desc',
                        defaultValue: true,
                        settingType: 'boolean',
                    },
                ],
            },
        ],
    },
};

module.exports = adminSettingsFormData;