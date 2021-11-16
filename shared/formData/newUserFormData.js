const CONFIG = require('./../../CONFIG').USER;

const newUserFormData = {
    formId: 'new-user-form',
    path: '/api/users',
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
            labelId: 'new_user_level',
            type: 'select-user-level',
            value: 1,
        },
        loginAccessGroup: {
            labelId: 'new_user_groups',
            type: 'select-user-group',
            value: [],
        },
    },
    form: {
        formTitleId: 'register_new_user',
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsgId: 'new_user_registered',
        afterSubmitShowOnlyMsg: true,
        server: {
            useRightLevel: 0, // 0 = Public form
            useRightUsers: [],
            useRightGroups: [],
            editFormLevel: 9,
            editFormUsers: [],
            editFormGroups: [],
            newUserLevel: 1, // Level of the new user
            newUserGroups: [], // Groups that the registered user belongs
        },
        submitButton: {
            id: 'submit-button-id',
            labelId: 'create_new_user_button',
        },
        submitFields: [ 'username', 'name', 'email', 'password' ],
        fieldsets: [
            {
                // FIELDSET
                id: 'main-fieldset',
                fields: [
                    { type: 'divider' },
                    {
                        // USERNAME
                        type: 'textinput',
                        id: 'username',
                        labelId: 'username',
                        required: true,
                        minLength: CONFIG.username.minLength,
                        maxLength: 24,
                        regex: '^[a-zA-Z0-9åöäñüéèêâîôûčßàìòùóçęįųķļņģëïõžšæøėēūāīÅÖÄÑÜÉÈÊÂÎÔÛČẞÀÌÒÙÓÇĘĮŲĶĻŅĢËÏÕŽŠÆØĖĒŪĀĪ]+$', // Current langs: finnish, english, swedish, norwegian, danish, german, french, spanish, italian, estonian, latvian, lithuanian
                        regexErrorMsgId: 'username_invalid_characters',
                    },
                    {
                        // NAME
                        type: 'textinput',
                        id: 'name',
                        labelId: 'name',
                        required: CONFIG.name.required,
                        minLength: CONFIG.name.minLength,
                        maxLength: 40,
                        regex: '[a-zA-ZåöäñüéèêâîôûčßàìòùóçęįųķļņģëïõžšæøėēūāīÅÖÄÑÜÉÈÊÂÎÔÛČẞÀÌÒÙÓÇĘĮŲĶĻŅĢËÏÕŽŠÆØĖĒŪĀĪ]+$', // Current langs: finnish, english, swedish, norwegian, danish, german, french, spanish, italian, estonian, latvian, lithuanian
                        regexErrorMsgId: 'field_has_invalid_characters',
                    },
                    { type: 'divider' },
                    {
                        // EMAIL
                        type: 'textinput',
                        id: 'email',
                        labelId: 'email',
                        required: CONFIG.email.required,
                        maxLength: 50,
                        email: true,
                    },
                    { type: 'divider' },
                    {
                        // PASSWORD
                        type: 'textinput',
                        id: 'password',
                        labelId: 'password',
                        required: true,
                        minLength: CONFIG.password.minLength,
                        maxLength: 50,
                        password: true,
                        validationFn: 'validatePass1',
                    },
                    {
                        // PASSWORD AGAIN
                        type: 'textinput',
                        id: 'password-again',
                        labelId: 'password_again',
                        required: true,
                        minLength: 0,
                        maxLength: 50,
                        password: true,
                        validationFn: 'validatePass2',
                    },
                    { type: 'divider' },
                ],
            },
        ],
    },
};

module.exports = newUserFormData;