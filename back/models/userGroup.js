const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userGroupSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
    },
    level: {
        type: Number,
        required: true,
    },
    creator: {
        id: mongoose.Schema.Types.ObjectId,
        date: Date,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            rights: [],
        }
    ],
});

userGroupSchema.plugin(uniqueValidator);
userGroupSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema, 'usergroups');

module.exports = UserGroup;