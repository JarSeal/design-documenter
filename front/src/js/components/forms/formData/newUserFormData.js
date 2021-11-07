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
                    validationFn: (args) => {
                        const { val, components, id, fieldErrors, fieldsetId } = args;
                        const pass2Val = components['password-again'].value;
                        const minLength = components['password'].data.field.minLength;
                        if(val.length >= minLength && pass2Val.length >= 1 && val !== components['password-again'].value) {
                            fieldErrors.set('password-again', {
                                errorMsgId: 'passwords_dont_match',
                                fieldsetId,
                                id
                            });
                            fieldErrors.set('password', { errorMsg: ' ' });
                        } else if(val.length >= minLength && val === components['password-again'].value) {
                            fieldErrors.set('password-again', false);
                            fieldErrors.set('password', false);
                        }
                        components['password-again'].displayFieldError();
                    },
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
                    validationFn: (args) => {
                        const { val, components, id, fieldErrors, fieldsetId } = args;
                        const pass1Val = components['password'].value;
                        const minLength = components['password'].data.field.minLength;
                        if(val.length >= 1 && val !== components['password'].value) {
                            fieldErrors.set('password-again', {
                                errorMsgId: 'passwords_dont_match',
                                fieldsetId,
                                id
                            });
                            if(!fieldErrors.get('password')) fieldErrors.set('password', { errorMsg: ' ' });
                        } else if(val.length >= 1 && pass1Val.length >= minLength && val === components['password'].value) {
                            fieldErrors.set('password-again', false);
                            fieldErrors.set('password', false);
                        }
                        components['password'].displayFieldError();
                    },
                },
                { type: 'divider' },
            ],
        },
    ],
};