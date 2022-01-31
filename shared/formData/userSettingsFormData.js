const CONFIG = require('./../../CONFIG').USER;

const adminSettingsFormData = {
    formId: 'user-settings-form',
    path: '/api/settings',
    method: 'PUT',
    type: 'form',
    useRightsLevel: 8,
    useRightsUsers: [],
    useRightsGroups: [],
    editorRightsLevel: 9,
    editorRightsUsers: [],
    editorRightsGroups: [],
    form: {
        onErrorsMsgId: 'form_has_errors',
        afterSubmitMsg: '',
        afterSubmitShowOnlyMsg: true,
        singleEdit: true,
        submitButton: {
            id: 'submit-user-settings-button-id',
            labelId: 'save',
            class: 'save-button',
        },
        submitFields: [ 'table-sorting-setting' ],
        fieldsets: [
            {
                // FIELDSET
                id: 'user-settings-login-fs',
                fieldsetTitleId: 'tables',
                fields: [
                    {
                        // Table sort and filter
                        type: 'dropdown',
                        id: 'table-sorting-setting',
                        labelId: 'table_sorting_memory',
                        descriptionId: 'table_sorting_memory_desc',
                        settingType: 'string',
                        defaultValue: 'none',
                        options: [
                            { value: 'none', labelId: 'none' },
                            { value: 'session', labelId: 'save_for_this_session' },
                            { value: 'browser', labelId: 'save_for_this_browser' },
                        ],
                    },
                ],
            },
        ],
    },
};

module.exports = adminSettingsFormData;