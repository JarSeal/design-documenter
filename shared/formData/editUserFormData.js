const CONFIG = require('./../../CONFIG').USER;

const newUserFormData = {
    formId: 'edit-user-form',
    path: '/api/users/:userId',
    method: 'PUT',
    type: 'form',
    useRightsLevel: 8,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsgId: 'user_edited',
        afterSubmitShowOnlyMsg: true,
        submitButton: {
            id: 'submit-edit-user-button-id',
            labelId: 'create_new_user_button',
        },
        submitFields: [ 'name', 'email', 'userLevel' ],
        fieldsets: [
            {
                // FIELDSET
                id: 'edit-user-main-fs',
                fields: [
                    { type: 'divider' },
                    {
                        // USERNAME
                        type: 'textinput',
                        id: 'username',
                        labelId: 'username',
                        locked: true,
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
                        // USERLEVEL
                        type: 'dropdown',
                        id: 'userLevel',
                        labelId: 'user_level',
                        required: true,
                        getOptionsFn: 'userLevels',
                    },
                    { type: 'divider' },
                ],
            },
        ],
    },
};

module.exports = newUserFormData;