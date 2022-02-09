
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
        readRightLevels: {
            username: {
                labelId: 'username',
                type: 'select-user-level',
                value: 0,
                locked: true,
            },
            name: {
                labelId: 'name',
                type: 'select-user-level',
                value: 2,
            },
            email: {
                labelId: 'email',
                type: 'select-user-level',
                value: 8,
            },
            userLevel: {
                labelId: 'user_level',
                type: 'select-user-level',
                value: 8,
            },
            created: {
                labelId: 'created',
                type: 'select-user-level',
                value: 8,
            },
            edited: {
                labelId: 'edited',
                type: 'select-user-level',
                value: 8,
            },
        },
    },
};

module.exports = readOneUserFormData;