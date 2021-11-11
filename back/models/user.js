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
    userGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserGroup',
        },
    ],
    created: {
        by: String,
        publicForm: Boolean,
        date: Date,
    },
    edited: [
        {
            by: String,
            selfEdited: Boolean,
            date: Date,
        }
    ],
    rights: {
        universe: {
            canCreate: Boolean,
            canEdit: Boolean,
            canDelete: Boolean,
        },
        structure: {
            canCreate: Boolean,
            canEdit: Boolean,
            canDelete: Boolean,
        },
        beacon: {
            canCreate: Boolean,
            canEdit: Boolean,
            canDelete: Boolean,
        },
        dataset: {
            canCreate: Boolean,
            canEdit: Boolean,
            canDelete: Boolean,
        },
    },
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