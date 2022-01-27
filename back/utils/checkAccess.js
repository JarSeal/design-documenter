const checkAccess = (request, check, settings) => {
    if(!check) return false;
    let userLevel = 0, userId;
    const loggedIn = checkIfLoggedIn(request.session);

    if(settings && !checkSettings(check, settings, loggedIn)) return false;
    
    if(loggedIn) {
        userLevel = request.session.userLevel;
        userId = request.session._id;
    }
    
    // Check user level
    if(userLevel >= check.useRightsLevel) {
        return true;
    }

    // Check user list
    if(check.useRightsUsers && check.useRightsUsers.length) {
        for(let i=0; i<check.useRightsUsers.length; i++) {
            if(userId === check.useRightsUsers[i]) return true;
        }
    }
    
    // Check groups
    // TODO

    return false;
};

const checkIfLoggedIn = (sess) => {
    if(!sess || !sess.loggedIn) return false;
    return true;
};

const checkSettings = (check, settings, loggedId) => {
    if(check.formId === 'route-new-user') {
        if(loggedId) return false;
        return settings['public-user-registration'];
    } else if(check.formId === 'new-user-form') {
        return settings['public-user-registration'];
    }
    return true;
};

module.exports = {
    checkAccess,
    checkIfLoggedIn,
};