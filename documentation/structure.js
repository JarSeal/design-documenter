// Documentation:
// Example of a Structure

const structure = {
    title: 'My Structure Title', // String [required]
    structureId: 'my-structure-id', // String [required, unique, regex='^[a-zA-Z0-9\-_]+$']
    description: 'Some structure description...', // String
    universeId: 'my-universe-id', // String, auto-added when structure is created
    structureGroupId: '', // String / null, [regex='^[a-zA-Z0-9\-_]+$']
    allowedTypes: null, // null / Array[String], if null then any data type is allowed
    size2d: {
        w: 32, // Number [required]
        h: 32, // Number [required]
    },
    pos2d: {
        x: 0, // Number [required]
        y: 0, // Number [required]
    },
};

const structureGroup = {
    title: 'My Structure Group Title', // String [required]
    structureGroupId: 'my-structure-group-id', // String [required, unique, regex='^[a-zA-Z0-9\-_]+$']
    description: 'Some structure group description...', // String
    universeId: 'my-universe-id', // String, auto-added when structure group is created
    size2d: {
        w: 100, // Number [required]
        h: 72, // Number [required]
    },
    pos2d: {
        x: 50, // Number [required]
        y: 0, // Number [required]
    },
};