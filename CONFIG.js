const USER = {
    username: {
        minLength: 5,
    },
    name: {
        minLength: 0,
        required: false,
    },
    email: {
        required: true,
        // unique: true,
    },
    password: {
        minLength: 6,
    }
};

module.exports = {
    USER,
};