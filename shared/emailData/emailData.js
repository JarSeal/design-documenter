const newUserEmail = require('./newUserEmail');
const newPassLinkEmail = require('./newPassLinkEmail');
const deleteOwnAccountEmail = require('./deleteOwnAccountEmail');
const passwordChangedEmail = require('./passwordChangedEmail');

const emailData = {
    newUserEmail,
    newPassLinkEmail,
    deleteOwnAccountEmail,
    passwordChangedEmail,
};

module.exports = emailData;