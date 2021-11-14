// Documentation:
// Example of a Universe

const universe = {
    title: 'My Project Title', // String [required]
    universeId: 'my-project-id', // String [required, unique, regex='^[a-zA-Z0-9\-_]+$']
    description: 'Some project description...', // String
    rights: {
        readRightUsers: [],
        readRightGroups: [],
        editRightUsers: [],
        editRightGroups: [],
        deleteRightUsers: [],
        deleteRightGroups: [],
    },
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
};