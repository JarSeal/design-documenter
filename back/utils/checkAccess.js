const checkAccess = (request, check) => {
    if(!check) return false;
    let userLevel = 0, userId;
    
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

module.exports = {
    checkAccess,
    checkIfLoggedIn,
};