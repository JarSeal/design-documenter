const CONFIG = require('./../../CONFIG').USER;

const deleteProfileFormData = {
    formId: 'delete-profile-form',
    path: '/api/users/own/delete',
    method: 'POST',
    type: 'form',
    useRightsLevel: 1,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        formDescId: 'delete_profile_warning_text',
        onErrorsMsgId: 'form_has_errors',
        formErrors: {
            error401Id: 'wrong_password',
            error403Id: 'this_user_cannot_be_deleted',
        },
        showBottomMsg: false,
        submitButton: {
            id: 'submit-delete-profile-button-id',
            labelId: 'delete',
            class: 'confirm-button--delete',
        },
        submitFields: [ 'password' ],
        fieldsets: [
            {
                // FIELDSET
                id: 'edit-user-main-fs',
                fields: [
                    { type: 'divider' },
                    {
                        // PASSWORD
                        type: 'textinput',
                        id: 'password',
                        labelId: 'password',
                        required: true,
                        maxLength: 50,
                        password: true,
                    },
                    { type: 'divider' },
                ],
            },
        ],
    },
};

module.exports = deleteProfileFormData;