const newUserEmail = require('./newUserEmail');
const newPassLinkEmail = require('./newPassLinkEmail');
const deleteOwnAccountEmail = require('./deleteOwnAccountEmail');
const passwordChangedEmail = require('./passwordChangedEmail');
const verifyAccountEmail = require('./verifyAccountEmail');
const twoFactorAuthEmail = require('./twoFactorAuthEmail');

const emailData = {
    newUserEmail,
    newPassLinkEmail,
    deleteOwnAccountEmail,
    passwordChangedEmail,
    verifyAccountEmail,
    twoFactorAuthEmail,
};

module.exports = emailData;
