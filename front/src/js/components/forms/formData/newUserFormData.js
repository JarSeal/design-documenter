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
    fieldsets: [
        {
            // FIELDSET
            id: 'test-fieldset',
            fields: [{
                    // TEXT INPUT
                    type: 'textinput',
                    id: 'username',
                    labelId: 'username',
                    required: true,
                    minLength: 3,
                    maxLength: 24,
                },
                {
                    // TEXT INPUT
                    type: 'textinput',
                    id: 'password',
                    labelId: 'password',
                    required: true,
                    minLength: 6,
                    maxLength: 40,
                    validationFn: (args) =>  {
                        if(args.val.length >= 6 && args.val !== args.components['password-again'].value) {
                            args.errorState.set('password-again', { errorMsg: 'Passwords don\'t match' });
                        } else if(args.val.length >= 6 && args.val === args.components['password-again'].value) {
                            args.errorState.set('password-again', false);
                        }
                    },
                },
                {
                    // TEXT INPUT
                    type: 'textinput',
                    id: 'password-again',
                    labelId: 'password_again',
                    required: true,
                    minLength: 6,
                    maxLength: 40,
                    validationFn: (args) => {
                        if(args.val.length >= 6 && args.val !== args.components['password'].value) {
                            args.errorState.set('password-again', { errorMsg: 'Passwords don\'t match' });
                        } else if(args.val.length >= 6 && args.val === args.components['password'].value) {
                            args.errorState.set('password-again', false);
                        }
                    },
                },
            ],
        },
    ],
};