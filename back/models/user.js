const CONFIG = require('./../shared').CONFIG.USER;
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UserGroup = require('./userGroup'); UserGroup;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: CONFIG.username.minLength,
    },
    name: {
        type: String,
        required: CONFIG.name.required,
        minlength: CONFIG.name.minLength,
    },
    email: {
        type: String,
        required: CONFIG.email.required,
        unique: CONFIG.email.required, // If required, has to be also unique
        minlength: 5,
    },
    passwordHash: String,
    userLevel: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 1,
    },
    created: {
        by: {
            type: mongoose.Schema.Types.ObjectId,
        },
        publicForm: Boolean,
        date: Date,
    },
    edited: [
        {
            _id: false,
            by: {
                type: mongoose.Schema.Types.ObjectId,
            },
            selfEdited: Boolean,
            date: Date,
        }
    ],
});

userSchema.plugin(uniqueValidator);
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;