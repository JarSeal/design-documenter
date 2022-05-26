const loginBeaconFormData = require('./loginBeaconFormData');
const loginTwoFABeaconFormData = require('./loginTwoFABeaconFormData');
const newUserFormData = require('./newUserFormData');
const newUniverseFormData = require('./newUniverseFormData');
const readUsersFormData = require('./readUsersFormData');
const deleteUsersFormData = require('./deleteUsersFormData');
const editUserFormData = require('./editUserFormData');
const readOneUserFormData = require('./readOneUserFormData');
const adminSettingsFormData = require('./adminSettingsFormData');
const userSettingsFormData = require('./userSettingsFormData');
const readProfileFormData = require('./readProfileFormData');
const editProfileFormData = require('./editProfileFormData');
const editExposeProfileFormData = require('./editExposeProfileFormData');
const deleteProfileFormData = require('./deleteProfileFormData');
const changePasswordFormData = require('./changePasswordFormData');
const newPassRequestFormData = require('./newPassRequestFormData');
const newPassWTokenFormData = require('./newPassWTokenFormData');
const emailVerificationFormData = require('./emailVerificationFormData');
const verifyAccountWToken = require('./verifyAccountWToken');

const formData = [
    loginBeaconFormData,
    loginTwoFABeaconFormData,
    newUserFormData,
    newUniverseFormData,
    readUsersFormData,
    deleteUsersFormData,
    editUserFormData,
    readOneUserFormData,
    adminSettingsFormData,
    userSettingsFormData,
    readProfileFormData,
    editProfileFormData,
    editExposeProfileFormData,
    deleteProfileFormData,
    changePasswordFormData,
    newPassRequestFormData,
    newPassWTokenFormData,
    emailVerificationFormData,
    verifyAccountWToken,
];

module.exports = formData;
