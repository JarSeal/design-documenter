const loginBeaconFormData = require('./loginBeaconFormData');
const newUserFormData = require('./newUserFormData');
const newUniverseFormData = require('./newUniverseFormData');
const readUsersFormData = require('./readUsersFormData');
const deleteUsersFormData = require('./deleteUsersFormData');
const editUserFormData = require('./editUserFormData');
const readOneUserFormData = require('./readOneUserFormData');
const adminSettingsFormData = require('./adminSettingsFormData');
const userSettingsFormData = require('./userSettingsFormData');

const formData = [
    loginBeaconFormData,
    newUserFormData,
    newUniverseFormData,
    readUsersFormData,
    deleteUsersFormData,
    editUserFormData,
    readOneUserFormData,
    adminSettingsFormData,
    userSettingsFormData,
];

module.exports = formData;