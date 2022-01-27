import { getText } from "../../helpers/lang";
import FormCreator from "../forms/FormCreator";
import './SettingsGroup.scss';

const { Component } = require("../../LIGHTER");

// Attributes
// - settingsData: Object{
//     - fsId: String
//     - fsTitleId: String
//     - fsDescriptionId: String
//     - fields: Array[
//         {id:String, type:String, value:String, defaultValue:String|Number, options:Dropdown options, labelId, descriptionId}
//       ]
//   }
//  - updateSettings: Function
class SettingsGroup extends Component {
    constructor(data) {
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
                const fieldId = this.settingsData.fields[index].mongoId;
                this.Dialog.appear({
                    component: FormCreator,
                    componentData: {
                        id: 'admin-settings-form',
                        appState: this.appState,
                        editDataId: fieldId,
                        addToMessage: { mongoId: fieldId },
                        beforeFormSendingFn: () => {
                            this.Dialog.lock();
                        },
                        afterFormSentFn: () => {
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
                            class: 'some-class',
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
        this.fieldset = this.addChild({
            id: this.id + '-wrapper',
            template: `<div class="settings-group">` +
                `<h3>${getText(this.settingsData.fsTitleId)}</h3>` +
                (this.settingsData.fsDescriptionId
                    ? `<p>${getText(this.settingsData.fsDescriptionId)}</p>`
                    : '') +
                `<div id="${this.fsInnerWrapperId}"></div>` +
            '<div>',
        });
        this.fields = [];
        for(let i=0; i<this.settingsData.fields.length; i++) {
            const field = this.settingsData.fields[i];
            this.fields.push(this.addChild({
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
            }));
        }
    }

    _displayValue = (field) => {
        if(field.type === 'checkbox') {
            return field.value === true || field.value === 'true'
                ? getText('on').toUpperCase()
                : getText('off').toUpperCase();
        }
        return field.value;
    }
}

export default SettingsGroup;