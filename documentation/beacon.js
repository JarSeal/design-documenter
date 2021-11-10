// Documentation:
// Example of a Beacon

const beacon = {
    title: 'My Beacon Title', // String [required]
    beaconId: 'my-beacon-id', // String [required, unique, regex='^[a-zA-Z0-9\-_]+$']
    description: 'Some beacon description...', // String
    universeId: 'my-universe-id', // String, auto-added when beacon is created
    structureId: 'my-structure-id', // String, auto-added when beacon is created
    allowedTypes: null, // null / Array[String], if null then any data type is allowed
    typeConfigurations: null, // Object(with data type keys and configs as values), this is filled with allowed type configurations (eg. if type is form data, then the fields will be here)
    fillFromTop: false, // Boolean, if true the data will be prepended to the beginning of the array (default false = append)
    data: [
        '[mongo _id 1]', // Referring to a dataset with this mongo _id
        '[mongo _id 2]', // Order of data comes from the array
    ],
    size2d: {
        w: 32, // Number [required]
        h: 32, // Number [required]
    },
    pos2d: {
        x: 0, // Number [required]
        y: 0, // Number [required]
    },
};

const dataTypes = [
    {
        dataTypeId: 'raw-text',
        title: 'Raw Text', // This will show when selecting a data type for a beacon
        description: '',
        config: { // Config fields when creating a beacon with this type
            minLength: 'numberint',
            maxLength: 'numberint',
            required: 'checkbox',
            label: 'textinput',
            regex: 'textinput', // Maybe later add a regex form type
            regexErrorMsg: 'textinput',
        },
        valueThumbFn: (data) => { return data.value.substring(0, 11) + '...'; },
        valueFn: (data) => { return data.value; },
    },
    {
        dataTypeId: 'form-data',
        title: 'Form Data',
        requiresBeacon: true,
        description: '',
        config: {
            fields: [
                {
                    type: 'textinput',
                    // ...requirements, regex, options, etc. (same field options as forms have)
                },
                // ...rest of fields that are setup when the beacon is created
            ],
        },
        valueThumbFn: (data) => { return `${data.config.fields.length} Fields`; },
        valueFn: (data) => { return data.value; },
    },
];
