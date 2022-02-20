const CONFIG = require('./../../CONFIG').USER;

const options = [
    { value: 0, labelId: 'view_right_public_can_see' },
    { value: 1, labelId: 'view_right_authenticated_can_see' },
    { value: 2, labelId: 'View_right_hidden' },
];

const editExposeProfileFormData = {
    formId: 'edit-expose-profile-form',
    path: '/api/users/own/profile',
    method: 'PUT',
    type: 'form',
    useRightsLevel: 1,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    editorOptions: {
        labelId_showToUsers: 'show_to_users',
        showToUsers: {
            username: {
                labelId: 'username',
                type: 'checkbox',
                value: true,
            },
            name: {
                labelId: 'name',
                type: 'checkbox',
                value: true,
            },
            email: {
                labelId: 'email',
                type: 'checkbox',
                value: true,
            },
            userLevel: {
                labelId: 'user_level',
                type: 'checkbox',
                value: true,
            },
            createDate: {
                labelId: 'created',
                type: 'checkbox',
                value: true,
            }
        },
    },
    form: {
        formDescId: 'edit_expose_profile_form_desc',
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsg: '',
        afterSubmitShowOnlyMsg: true,
        submitButton: {
            id: 'submit-edit-profile-button-id',
            labelId: 'save',
            class: 'save-button',
        },
        submitFields: [ 'name', 'userLevel', 'created' ],
        fieldsets: [
            {
                // FIELDSET
                id: 'edit-user-main-fs',
                fields: [
                    { type: 'divider' },
                    {
                        // USERNAME
                        type: 'dropdown',
                        id: 'username',
                        labelId: 'username',
                        disabled: true,
                        defaultValue: 0,
                        options,
                    },
                    {
                        // NAME
                        type: 'dropdown',
                        id: 'name',
                        labelId: 'name',
                        defaultValue: 1,
                        options,
                    },
                    { type: 'divider' },
                    {
                        // EMAIL
                        type: 'dropdown',
                        id: 'email',
                        labelId: 'email',
                        disabled: true,
                        defaultValue: 2,
                        options,
                    },
                    { type: 'divider' },
                    {
                        // USERLEVEL
                        type: 'dropdown',
                        id: 'userLevel',
                        labelId: 'user_level',
                        defaultValue: 2,
                        options,
                    },
                    {
                        // CREATED.DATE
                        type: 'dropdown',
                        id: 'created',
                        labelId: 'created',
                        defaultValue: 1,
                        options,
                    },
                ],
            },
        ],
    },
};

module.exports = editExposeProfileFormData;