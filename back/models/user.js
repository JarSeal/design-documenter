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
    minlength: 5
  },
  name: String,
  email: {
    type: String,
    required: true,
    minlength: 5
  },
  passwordHash: String,
  userGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserGroup'
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
  }
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