
const readUsersFormData = {
    formId: 'new-email-verification',
    path: '/api/users/newemailverification',
    method: 'GET',
    type: 'form',
    useRightsLevel: 1,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        class: 'confirmation-form',
        afterSubmitShowOnlyMsg: true,
        submitButton: {
            id: 'new-email-verification-button',
            labelId: 'send',
        },
    },
};

module.exports = readUsersFormData;