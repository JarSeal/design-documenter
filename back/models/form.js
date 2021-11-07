const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UserGroup = require('./userGroup'); UserGroup;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const formSchema = mongoose.Schema({
    formId: {
        
    }
});

formSchema.plugin(uniqueValidator);
formSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Form = mongoose.model('Form', formSchema, 'forms');

module.exports = Form;