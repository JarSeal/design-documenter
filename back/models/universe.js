const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const universeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    universeId: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    created: {
        by: String,
        autoCreated: Boolean,
        date: Date,
    },
    edited: [
        {
            by: String,
            date: Date,
        }
    ],
});

universeSchema.plugin(uniqueValidator);
universeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Universe = mongoose.model('Universe', universeSchema, 'universes');

module.exports = Universe;