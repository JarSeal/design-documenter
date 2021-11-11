const CONFIG = require('./../../CONFIG').USER;

// Create a new universe:
const newUniverseFormData = {
    id: 'new-universe-form',
    onErrorsMsgId: 'form_has_errors',
    afterSubmitMsgId: 'new_universe_created',
    afterSubmitShowOnlyMsg: true,
    submitButton: {
        id: 'submit-new-universe-button',
        labelId: 'create_new_universe',
    },
    submitFields: [],
    fieldsets: [
        {
            id: 'main-fieldset-new-uni',
            fields: [
                { type: 'divider' },
                {
                    // TITLE / NAME
                    type: 'textinput',
                    id: 'new-uni-title',
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
                    id: 'new-uni-id',
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
                    type: 'textinput',
                    id: 'new-uni-description',
                    labelId: 'description',
                    maxLength: 500,
                    email: true,
                },
                { type: 'divider' },
            ],
        },
    ],
};

module.exports = newUniverseFormData;