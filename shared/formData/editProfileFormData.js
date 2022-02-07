const CONFIG = require('./../../CONFIG').USER;

const newUserFormData = {
    formId: 'edit-propfile-form',
    path: '/api/users/profile',
    method: 'PUT',
    type: 'form',
    useRightsLevel: 1,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsg: '',
        afterSubmitShowOnlyMsg: true,
        submitButton: {
            id: 'submit-edit-profile-button-id',
            labelId: 'save',
            class: 'save-button',
        },
        submitFields: [ 'name', 'email' ],
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
                        disabled: true,
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
                ],
            },
        ],
    },
};

module.exports = newUserFormData;