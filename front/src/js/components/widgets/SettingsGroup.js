import { getText } from "../../helpers/lang";

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
class SettingsGroup extends Component {
    constructor(data) {
        super(data);
        this.settingsData = data.settingsData;
        this.fsInnerWrapperId = this.id + '-fs-inner-wrapper';
        this.fieldset;
        this.fields = [];
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
                id: field.id,
                template: '<div class="settings-field">' +
                    `<div class="settings-field__label">${getText(field.labelId)}</div>` +
                    (field.descriptionId
                        ? `<div class="settings-field__description">${getText(field.descriptionId)}</div>`
                        : '') +
                    `<div class="settings-field__value">${field.value}</div>` +
                '</div>',
            }));
            console.log('FIELD', field);
        }
    }
}

export default SettingsGroup;