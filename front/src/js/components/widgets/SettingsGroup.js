import { Component } from '../../LIGHTER';
import { getText } from '../../helpers/lang';
import FormCreator from '../forms/FormCreator';
import './SettingsGroup.scss';

// Attributes
// - settingsData: Object{
//     - fsId: String
//     - fsTitleId: String
//     - fsDescriptionId: String
//     - fields: Array[
//         {id:String, type:String, value:String, defaultValue:String|Number, options:Dropdown options, labelId, descriptionId}
//       ]
//   }
//  - formId: String
//  - updateSettings: Function
class SettingsGroup extends Component {
    constructor(data) {
        data.class = 'settings-group';
        super(data);
        this.settingsData = data.settingsData;
        this.fsInnerWrapperId = this.id + '-fs-inner-wrapper';
        this.fieldset;
        this.fields = [];
        this.appState = this.Router.commonData.appState;
        this.Dialog = this.appState.get('Dialog');
        this.updateSettings = data.updateSettings;
    }

    addListeners = () => {
        this.addListener({
            id: this.settingsData.fsId + '-edit-button-listener',
            type: 'click',
            fn: (e) => {
                const index = parseInt(e.target.getAttribute('i'));
                if(isNaN(index)) return;
                let fieldId = this.settingsData.fields[index].mongoId;
                if(!fieldId) fieldId = this.settingsData.fields[index].id;
                this.Dialog.appear({
                    component: FormCreator,
                    componentData: {
                        id: this.data.formId,
                        appState: this.appState,
                        editDataId: fieldId,
                        addToMessage: { mongoId: fieldId },
                        beforeFormSendingFn: () => {
                            this.Dialog.lock();
                        },
                        afterFormSentFn: (response) => {
                            this.appState.set('serviceSettings', response.data);
                            this.updateSettings();
                            this.Dialog.disappear();
                        },
                        onErrorsFn: (ex, res) => {
                            this.Dialog.unlock();
                            this.updateSettings();
                            if(res && res.status === 401) this.Router.changeRoute('/');
                        },
                        onFormChages: () => { this.Dialog.changeHappened(); },
                        formLoadedFn: () => { this.Dialog.onResize(); },
                        extraButton: {
                            label: getText('cancel'),
                            clickFn: (e) => {
                                e.preventDefault();
                                this.Dialog.disappear();
                            },
                        },
                    },
                    title: getText('edit_setting'),
                });
            },
        });
    }

    init = () => {
        this._createComponents();
    }

    paint = () => {
        this.drawChildren();
    }

    _createComponents = () => {
        this.addChildDraw({
            id: this.id + '-wrapper',
            template: '<div class="settings-group__inner">' +
                `<h3 class="group-title">${getText(this.settingsData.fsTitleId)}</h3>` +
                (this.settingsData.fsDescriptionId
                    ? `<p>${getText(this.settingsData.fsDescriptionId)}</p>`
                    : '') +
                `<div id="${this.fsInnerWrapperId}"></div>` +
            '<div>',
        });
        this.fields = [];
        for(let i=0; i<this.settingsData.fields.length; i++) {
            const field = this.settingsData.fields[i];
            this.addChildDraw({
                id: field.id + '-field-listing',
                attach: this.fsInnerWrapperId,
                template: '<div class="settings-field">' +
                    `<div class="settings-field__label">${getText(field.labelId)}:</div>` +
                    `<div class="settings-field__value">${this._displayValue(field)}</div>` +
                    (field.descriptionId
                        ? `<div class="settings-field__description">${getText(field.descriptionId)}</div>`
                        : '') +
                    `<button class="edit-setting-button" id="${this.settingsData.fsId}-edit-button" i="${i}">` +
                        getText('edit') +
                    '</button>' +
                '</div>',
            });
        }
    }

    _displayValue = (field) => {
        if(field.type === 'checkbox') {
            return field.value === true || field.value === 'true'
                ? getText('on').toUpperCase()
                : getText('off').toUpperCase();
        } else if(field.type === 'dropdown') {
            let options = field.options;
            if(options) {
                for(let i=0; i<options.length; i++) {
                    if(String(field.value) === String(options[i].value)) {
                        return getText(options[i].labelId);
                    }
                }
            }
        }
        return field.value; // String or Number
    }
}

export default SettingsGroup;