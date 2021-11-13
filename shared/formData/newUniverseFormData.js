const CONFIG = require('./../../CONFIG').USER;

// Create a new universe:
const newUniverseFormData = {
    id: 'new-universe-form',
    api: '/universes',
    onErrorsMsgId: 'form_has_errors',
    afterSubmitShowOnlyMsg: true,
    server: {
        useRightLevel: 2,
        editFormLevel: 9,
    },
    submitButton: {
        id: 'submit-new-universe-button',
        labelId: 'create_new_universe',
    },
    submitFields: ['universeTitle', 'universeId', 'universeDescription'],
    fieldsets: [
        {
            id: 'main-fieldset-new-uni',
            fields: [
                { type: 'divider' },
                {
                    // TITLE / NAME
                    type: 'textinput',
                    id: 'universeTitle',
                    labelId: 'name',
                    required: true,
                    minLength: 1,
                    maxLength: 40,
                    regex: '[a-zA-ZåöäñüéèêâîôûčßàìòùóçęįųķļņģëïõžšæøėēūāīÅÖÄÑÜÉÈÊÂÎÔÛČẞÀÌÒÙÓÇĘĮŲĶĻŅĢËÏÕŽŠÆØĖĒŪĀĪ]+$', // Current langs: finnish, english, swedish, norwegian, danish, german, french, spanish, italian, estonian, latvian, lithuanian
                    regexErrorMsgId: 'field_has_invalid_characters',
                },
                { type: 'divider' },
                {
                    // UNIVERSE ID
                    type: 'textinput',
                    id: 'universeId',
                    labelId: 'new_universe_id',
                    required: true,
                    minLength: 1,
                    maxLength: 40,
                    regex: '^[a-zA-Z0-9-_]+$',
                    regexErrorMsgId: 'field_has_invalid_characters',
                },
                { type: 'divider' },
                {
                    // DESCRIPTION
                    type: 'textarea',
                    id: 'universeDescription',
                    labelId: 'description',
                    maxLength: 500,
                },
                { type: 'divider' },
            ],
        },
    ],
};

module.exports = newUniverseFormData;