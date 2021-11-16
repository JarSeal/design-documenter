const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const formSchema = mongoose.Schema({
    formId: {
        type: String,
        required: true,
        unique: true,
    },
    path: String,
    method: String,
    type: {
        type: String,
        required: true,
    },
    useRightsLevel: {
        type: Number,
        required: true,
    },
    useRightsUsers: [{ type: String }],
    useRightsGroups: [{ type: String }],
    editorRightsLevel: {
        type: Number,
        required: true,
    },
    editorRightsUsers: [{ type: String }],
    editorRightsGroups: [{ type: String }],
    editorOptions: {
        type: Object,
    },
    form: {
        type: Object,
    },
    created: {
        by: String,
        autoCreated: Boolean,
        date: Date,
    },
    edited: [
        {
            by: String,
            autoEdited: Boolean,
            date: Date,
        }
    ],
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