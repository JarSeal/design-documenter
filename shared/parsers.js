const validateEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
};

const validateSimpleId = (id) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(id);
}

const urlParamRoute = (route, recover) => {
    if(!recover) return route.replace(/\//g, '**');
    return route.replace(/**/g, '/');
};

module.exports = {
    validateEmail,
    validateSimpleId,
    urlParamRoute,
};