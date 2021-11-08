// Register or create a new user:

export const newUserFormData = {
    // FORM
    id: 'new-user-form',
    formToken: null,
    formTitleId: 'route_title_new_user',
    onErrorsMsgId: 'fix_issues_on_form',
    submitButton: {
        id: 'submit-button-id',
        labelId: 'create_new_user_button',
    },
    submitFields: [ 'username', 'name', 'email', 'password' ],
    fieldsets: [
        {
            // FIELDSET
            id: 'test-fieldset',
            fields: [
                { type: 'divider' },
                {
                    // USERNAME
                    type: 'textinput',
                    id: 'username',
                    labelId: 'username',
                    required: true,
                    minLength: 3,
                    maxLength: 24,
                },
                {
                    // NAME
                    type: 'textinput',
                    id: 'name',
                    labelId: 'name',
                    maxLength: 40,
                },
                { type: 'divider' },
                {
                    // EMAIL
                    type: 'textinput',
                    id: 'email',
                    labelId: 'email',
                    required: true,
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
                    minLength: 3,
                    maxLength: 40,
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
                    maxLength: 40,
                    password: true,
                    validationFn: 'validatePass2',
                },
                { type: 'divider' },
            ],
        },
    ],
};