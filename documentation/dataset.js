// Documentation:
// Example of a Dataset

const dataset = {
    type: 'raw-text', // String [required], a data type id
    universeId: 'my-universe-id',
    created: {
        by: '[mongo user _id]', // String [required], mongo user id
        date: Date, // Date [required]
    },
    edited: [
        {
            by: '[mongo user _id]',
            date: Date,
        }
    ],
    value: 'Some text without formatting...', // String / Array / Object / Number (no functions)
};