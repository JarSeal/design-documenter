const checkAccess = (request, check, settings) => {
    if(!check) return false;
    let userLevel = 0, userId;

    if(settings && !checkSettings(check, settings, request.session)) return false;
    
    if(checkIfLoggedIn(request.session)) {
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

// Maybe move to settingsService?
const checkSettings = (check, settings, session) => {
    const loggedIn = checkIfLoggedIn(session);
    if(check.formId === 'route-new-user') {
        if(loggedIn) return false;
        return settings['public-user-registration'];
    } else if(check.formId === 'new-user-form') {
        if(loggedIn) {
            return settings['user-level-required-to-register'] <= session.userLevel;
        }
        return settings['public-user-registration'];
    }
    return true;
};

module.exports = {
    checkAccess,
    checkIfLoggedIn,
};