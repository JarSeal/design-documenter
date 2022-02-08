
const readOneUserFormData = {
    formId: 'read-one-user',
    path: '/api/users/:userid',
    method: 'GET',
    type: 'readapi',
    useRightsLevel: 0,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
    editorOptions: {
        fieldReadRightLevels: {
            username: {
                labelId: 'username',
                type: 'select-user-level',
                value: 0,
            },
            // Continue here..
        },
    },
};

module.exports = readOneUserFormData;