import { createDate } from "../../helpers/date";
import { Component } from "../../LIGHTER";
import './Table.scss';

// Attributes for data:
// - tableData: Array[Object]
// - hideTableHeader: Boolean,
// - fullWidth: Boolean,
// - tableStructure: Array[Object] [required] (array order is the order of the columns)
//     {
//       key: String, [required] (the key in tableData item/object),
//       heading: String,
//       minWidth: String, (CSS min-width)
//       maxWidth: String, (CSS max-width)
//       width: String, (CSS width)
//       class: Array[String]/String, (CSS class(es) for the column)
//     }
class Table extends Component {
    constructor(data) {
        super(data);
        this.tableStructure = data.tableStructure;
        if(!this.tableStructure) {
            this.logger.error('Table component needs to have a tableStructure attribute: Array of Objects ({key:String}).');
            throw new Error('Call stack');
        }
        this.tableData = data.tableData;
        console.log('tableData', this.tableData);
        console.log('tableStructure', this.tableStructure);
        this.template = `<div class="table-wrapper">${this._createTable()}</div>`;
    }

    _createTable = () => {
        return '<table class="table-compo"' +
            (this.data.fullWidth ? ' style="width:100%;"' : '') +
        '>' +
            this._createTableHeader() +
            this._createDataRows() +
        '</table>';
    }

    _createDataRows = () => {
        let row = '';
        for(let i=0; i<this.tableData.length; i++) {
            row += '<tr>';
            for(let j=0; j<this.tableStructure.length; j++) {
                row += '<td' +
                    this._createRowClasses(this.tableStructure[j].class) +
                    this._createRowStyle(this.tableStructure[j]) +
                '>';
                row += this._formatCellData(
                    this._getCellData(i, j),
                    j
                );
                row += '</td>';
                if(j === 3)
                console.log('TYPE OF', typeof this._getCellData(i, j), new Date(this._getCellData(i, j)).getFullYear());
            }
            row += '</tr>';
        }
        return row;
    }

    _getCellData = (tableIndex, structIndex) => {
        const row = this.tableData[tableIndex];
        const key = this.tableStructure[structIndex].key;
        if(key.includes('.')) {
            const splitKey = key.split('.');
            let pos = row;
            for(let i=0; i<splitKey.length; i++) {
                pos = pos[splitKey[i]];
                if(!pos) return '';
            }
            return pos;
        } else {
            return row[key];
        }
    }

    _createTableHeader = () => {
        if(this.data.hideTableHeader) return '';
        let header = '<thead><tr>';
        for(let i=0; i<this.tableStructure.length; i++) {
            header += '<th' +
                this._createRowClasses(this.tableStructure[i].class) +
                this._createRowStyle(this.tableStructure[i]) +
            '>' +
                (this.tableStructure[i].heading
                    ? this.tableStructure[i].heading
                    : this.tableStructure[i].key) +
            '</th>';
        }
        header += '</tr></thead>';
        return header;
    }

    _createRowClasses = (classes) => {
        if(!classes) return '';
        if(typeof classes === 'string' || classes instanceof String) {
            return ' class="' + classes + '"';
        } else {
            let classList = '';
            for(let i=0; i<classes.length; i++) {
                if(!classList.length) {
                    classList = classes[i];
                } else {
                    classList += ' ' + classes[i];
                }
            }
            return ' class="' + classList + '"';
        }
    }

    _createRowStyle = (column) => {
        let styles = '';
        if(column.width) styles += 'width:' + column.width + ';';
        if(column.minWidth) styles += 'min-width:' + column.minWidth + ';';
        if(column.maxWidth) styles += 'max-width:' + column.maxWidth + ';';
        if(!styles.length) return '';
        return ' style="' + styles + '"';
    }

    _formatCellData = (value, structIndex) => {
        if(!value || !value.length) return '';
        const type = this.tableStructure[structIndex].type;
        if(type) {
            if(type === 'Date') {
                return createDate(value);
            }
        }

        return value;
    }
}

export default Table;