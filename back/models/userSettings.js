const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSettingSchema = mongoose.Schema({
    settingId: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    defaultValue: {
        type: String,
        required: true,
    },
    labelId: {
        type: String,
        required: true,
    },
    descriptionId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    edited: [
        {
            _id: false,
            by: {
                type: mongoose.Schema.Types.ObjectId,
            },
            date: Date,
        }
    ],
});

userSettingSchema.plugin(uniqueValidator);
userSettingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const UserSetting = mongoose.model('UserSetting', userSettingSchema, 'usersettings');

module.exports = UserSetting;