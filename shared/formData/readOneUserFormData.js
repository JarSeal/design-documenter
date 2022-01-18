
const readOneUserFormData = {
    formId: 'read-one-user',
    path: '/api/users/:userid',
    method: 'GET',
    type: 'readapi',
    useRightsLevel: 2,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 8,
    editorRightsUsers: [],
    editorRightsGroups: [],
};

module.exports = readOneUserFormData;