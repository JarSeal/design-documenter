// This shows all the possible

export const testFormData = {
    // FORM
    id: 'test-form', // String [required]
    formToken: null, // TODO
    class: ['css-class-name'], // String / Array
    formTitle: { en: 'Form title', fi: 'Lomakkeen otsikko' }, // Lang object / String
    formTitleId: 'route_title_new_user', // String (Transalation id for getText)
    formDesc: { en: 'Form description', fi: 'Lomakkeen kuvausteksti' }, // Lang object / String
    formDescId: 'login_error_empty', // String (Transalation id for getText)
    onErrorsMsg: { en: 'Form has errors.', fi: 'Lomakkeessa on virheitä' }, // Lang object / String
    onErrorsMsgId: 'form_has_errors', // String (Transalation id for getText)
    submitButton: {
        id: 'submit-button-id', // String
        label: { en: 'Submit', fi: 'Lähetä' }, // Lang object / String
        labelId: 'submit', // String (Transalation id for getText),
        class: 'submit-button-extra-class', // String / Array
    },
    fieldsets: [ // [required]
        {
            // FIELDSET
            id: 'test-fieldset', // String [required]
            class: ['css-class-name2'], // String / Array
            fieldsetTitle: { en: 'Section title', fi: 'Osion otsikko' }, // Lang object / String
            fieldsetTitleId: 'route_title_new_user', // String (Transalation id for getText)
            fieldsetDesc: { en: 'Section description', fi: 'Osion kuvaus' }, // Lang object / String
            fieldsetDescId: 'fix_issues_on_form', // String (Transalation id for getText)
            disabled: false, // Boolean / function
            canCollapse: true, // Boolean / function (whether the fieldset can be collapsed or opened)
            collapsed: false, // Boolean / function
            fields: [
                {
                    // DIVIDER
                    type: 'divider', // String [required]
                    class: 'some-divider-class', // String / Array
                },
                {
                    // SUB HEADING
                    type: 'subheading', // String [required]
                    class: 'some-subheading-class', // String / Array
                    content: { en: 'Sub Heading', fi: 'Alaotsikko' }, // Lang object / String
                    contentId: 'password', // String (Translation id for getText)
                },
                {
                    // TEXT INPUT
                    type: 'textinput', // String [required]
                    id: 'text-input-0', // String
                    name: 'text-input-0', // String (if undefined, the id is used for name)
                    password: false, // Boolean
                    class: ['css-class-name3'], // String / Array
                    label: { en: 'Text input', fi: 'Tekstin syöttö' }, // Lang object / String
                    labelId: 'some_translation_id', // String (Transalation id for getText)
                    placeholder: { en: 'Text placeholder', fi: 'Tekstin paikka' }, // Lang object / String
                    placeholderId: 'some_translation_id',
                    required: true, // Boolean / Function
                    minLength: 3, // Number
                    maxLength: 10, // Number/String
                    disabled: false, // Boolean / function
                    initValue: '', // String/Number
                    validationFn: (args) => { return true; }, // Function
                    onChangeFn: (args) => {}, // Function
                },
                {
                    // CHECKBOX
                    type: 'checkbox', // String [required]
                    id: 'checkbox-0', // String
                    name: 'checkbox-0', // String (if undefined, the id is used for name)
                    class: ['css-class-name4'], // String / Array
                    label: { en: 'Checkbox', fi: 'Checkboxi' }, // Lang object / String
                    labelId: 'some_translation_id', // String (Transalation id for getText)
                    required: false, // Boolean / function
                    disabled: false, // Boolean / function
                    initValue: true, // Boolean (whether the box is prechecked or not)
                    validationFn: (args) => { return true; }, // Function
                    onChangeFn: (args) => {}, // Function
                },
            ],
        },
    ],
};