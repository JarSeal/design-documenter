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
        partialEditPossible: true, // TODO: IMPLEMENT THIS FEATURE
        submitButton: {
            id: 'submit-admin-settings-button-id',
            labelId: 'save',
            class: 'save-button',
        },
        submitFields: [ 'max-login-attempts' ], // MAYBE NOT NEEDED FOR PARTIAL EDIT FEATURE
        fieldsets: [
            {
                // FIELDSET
                id: 'admin-settings-login-fs',
                fieldsetTitleId: 'login',
                fields: [
                    {
                        // USERNAME
                        type: 'textinput',
                        id: 'max-login-attempts',
                        labelId: 'max_login_attempts',
                        descriptionId: 'max_login_attempts_desc',
                        defaultValue: 5,
                        regex: '[0-9]+$',
                    },
                    // {
                    //     // NAME
                    //     type: 'textinput',
                    //     id: 'name',
                    //     labelId: 'name',
                    //     required: CONFIG.name.required,
                    //     minLength: CONFIG.name.minLength,
                    //     maxLength: 40,
                    //     regex: '[a-zA-ZåöäñüéèêâîôûčßàìòùóçęįųķļņģëïõžšæøėēūāīÅÖÄÑÜÉÈÊÂÎÔÛČẞÀÌÒÙÓÇĘĮŲĶĻŅĢËÏÕŽŠÆØĖĒŪĀĪ]+$', // Current langs: finnish, english, swedish, norwegian, danish, german, french, spanish, italian, estonian, latvian, lithuanian
                    //     regexErrorMsgId: 'field_has_invalid_characters',
                    // },
                    // { type: 'divider' },
                    // {
                    //     // EMAIL
                    //     type: 'textinput',
                    //     id: 'email',
                    //     labelId: 'email',
                    //     required: CONFIG.email.required,
                    //     maxLength: 50,
                    //     email: true,
                    // },
                    // { type: 'divider' },
                    // {
                    //     // USERLEVEL
                    //     type: 'dropdown',
                    //     id: 'userLevel',
                    //     labelId: 'user_level',
                    //     required: true,
                    //     getOptionsFn: 'userLevels',
                    //     minValue: 1,
                    //     maxValue: 8,
                    // },
                    // { type: 'divider' },
                ],
            },
        ],
    },
};

module.exports = adminSettingsFormData;