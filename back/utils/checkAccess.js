const checkAccess = (request, check) => {
    if(!check) return false;
    let userLevel = 0, userId;
    if(request.token && request.decodedToken.userLevel) {
        userLevel = request.decodedToken.userLevel;
        userId = request.decodedToken.id;
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

module.exports = {
    checkAccess,
};