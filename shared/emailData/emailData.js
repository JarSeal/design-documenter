const newUserEmail = require('./newUserEmail');
const newPassLinkEmail = require('./newPassLinkEmail');
const deleteOwnAccountEmail = require('./deleteOwnAccountEmail');

const emailData = {
    newUserEmail,
    newPassLinkEmail,
    deleteOwnAccountEmail,
};

module.exports = emailData;