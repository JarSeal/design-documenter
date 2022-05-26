const CONFIG = require('./../../CONFIG').USER;

const editProfileFormData = {
  formId: 'edit-profile-form',
  path: '/api/users/own/profile',
  method: 'PUT',
  type: 'form',
  useRightsLevel: 1,
  useRightsUsers: [],
  useRightsGroups: [],
  editorRightsLevel: 8,
  editorRightsUsers: [],
  editorRightsGroups: [],
  form: {
    onErrorsMsgId: 'form_has_errors',
    formErrors: {
      error401Id: 'wrong_password',
    },
    showBottomMsg: false,
    submitButton: {
      id: 'submit-edit-profile-button-id',
      labelId: 'save',
      class: 'save-button',
    },
    submitFields: ['name', 'email', 'curPassword'],
    fieldsets: [
      {
        // FIELDSET
        id: 'edit-user-main-fs',
        fields: [
          { type: 'divider' },
          {
            // USERNAME
            type: 'textinput',
            id: 'username',
            labelId: 'username',
            disabled: true,
          },
          {
            // NAME
            type: 'textinput',
            id: 'name',
            labelId: 'name',
            required: CONFIG.name.required,
            minLength: CONFIG.name.minLength,
            maxLength: 40,
            regex:
              '[a-zA-ZåöäñüéèêâîôûčßàìòùóçęįųķļņģëïõžšæøėēūāīÅÖÄÑÜÉÈÊÂÎÔÛČẞÀÌÒÙÓÇĘĮŲĶĻŅĢËÏÕŽŠÆØĖĒŪĀĪ]+$', // Current langs: finnish, english, swedish, norwegian, danish, german, french, spanish, italian, estonian, latvian, lithuanian
            regexErrorMsgId: 'field_has_invalid_characters',
          },
          { type: 'divider' },
          {
            // EMAIL
            type: 'textinput',
            id: 'email',
            labelId: 'email',
            required: CONFIG.email.required,
            maxLength: 50,
            email: true,
          },
          { type: 'divider' },
          {
            // CURRENT PASSWORD
            type: 'textinput',
            id: 'curPassword',
            labelId: 'current_password',
            required: true,
            maxLength: 50,
            password: true,
          },
          { type: 'divider' },
        ],
      },
    ],
  },
};

module.exports = editProfileFormData;
