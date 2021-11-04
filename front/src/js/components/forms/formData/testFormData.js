// This shows all the possible

export const testFormData = {
    // FORM
    id: 'test-form', // String [required]
    formToken: null, // TODO
    class: ['css-class-name'], // String / Array
    formTitle: { en: 'Form title', fi: 'Lomakkeen otsikko' }, // Lang object / String
    formTitleId: 'route_title_new_user', // String (Transalation id for getText)
    onErrorsMsg: { en: 'Form has errors.', fi: 'Lomakkeessa on virheitä' }, // Lang object / String
    onErrorsMsgId: 'form_has_errors', // String (Transalation id for getText)
    fieldsets: [ // [required]
        {
            // FIELDSET
            fieldsetId: 'test-fieldset', // String [required]
            class: ['css-class-name2'], // String / Array
            fieldsetTitle: { en: 'Section title', fi: 'Osion otsikko' }, // Lang object / String
            fieldsetTitleId: 'route_title_new_user', // String (Transalation id for getText)
            onErrorsMsg: { en: 'Group has errors.', fi: 'Ryhmässä on virheitä' }, // Lang object / String
            onErrorsMsgId: 'fieldset_has_errors', // String (Transalation id for getText)
            disabled: false, // Boolean / function
            canCollapse: true, // Boolean / function (whether the fieldset can be collapsed or opened)
            collapsed: false, // Boolean / function
            fields: [
                {
                    // TEXT INPUT
                    id: 'text-input-0', // String [required]
                    type: 'textinput', // String [required]
                    class: ['css-class-name3'], // String / Array
                    label: { en: 'Text input', fi: 'Tekstin syöttö' }, // Lang object / String
                    labelId: 'some_translation_id', // String (Transalation id for getText)
                    placeholder: { en: 'Text placeholder', fi: 'Tekstin paikka' }, // Lang object / String
                    placeholderId: 'some_translation_id',
                    required: true, // Boolean / Function
                    minLength: 3, // Number
                    maxLength: 10, // Number
                    disabled: false, // Boolean / function
                    initValue: '', // String
                    validation: () => { return true; }, // Function
                    onChange: () => {}, // Function
                },
                {
                    // CHECKBOX
                    id: 'checkbox-0', // String [required]
                    type: 'checkbox', // String [required]
                    class: ['css-class-name4'], // String / Array
                    label: { en: 'Checkbox', fi: 'Checkboxi' }, // Lang object / String
                    labelId: 'some_translation_id', // String (Transalation id for getText)
                    required: false, // Boolean / function
                    disabled: false, // Boolean / function
                    initValue: true, // Boolean (whether the box is prechecked or not)
                    validation: () => { return true; }, // Function
                    onChange: () => {}, // Function
                },
            ],
        },
    ],
};