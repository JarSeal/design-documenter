import { createDate } from "../../helpers/date";
import { getText } from "../../helpers/lang";
import { Component } from "../../LIGHTER";
import Button from "../buttons/Button";
import TextInput from "../forms/formComponents/TextInput";
import './Table.scss';

// Attributes for data:
// - tableData: Array[Object]
// - hideTableHeader: Boolean,
// - fullWidth: Boolean,
// - emptyStateMsg: String,
// - showStats: Boolean,
// - showRowNumbers: Boolean/String ('hover' means that the row number is only shown on hover and 'small' is the small numbers all the time, true creates a new column)
// - tableStructure: Array[Object] [required] (array order is the order of the columns)
//     {
//       key: String, [required] (the key in tableData item/object),
//       heading: String,
//       minWidth: String, (CSS min-width)
//       maxWidth: String, (CSS max-width)
//       width: String, (CSS width)
//       class: Array[String]/String, (CSS class(es) for the column)
//       unsortable: Boolean, (if the column should not be sortable, default false)
//       sort: String, (can be either 'desc' or 'asc')
//       type: String, (special parsing for a column data (eg. 'Date'), this is defined at _formatCellData)
//     }
class Table extends Component {
    constructor(data) {
        super(data);
        this.tableStructure = data.tableStructure;
        if(!this.tableStructure) {
            this.logger.error('Table component needs to have a tableStructure attribute: Array of Objects ({key:String}).');
            throw new Error('Call stack');
        }
        if(this.data.showRowNumbers === true) {
            this.tableStructure = [
                {
                    key: '_row-number',
                    heading: '#',
                    unsortable: true,
                },
                ...this.tableStructure
            ];
        }
        this.tableData = data.tableData;
        this.allData = [...this.tableData];
        this.template = `<div class="table-wrapper"></div>`;
        this.tableComp;
        this.statsComp;
        this.filterComp;
        this.filterString = '';
        this.filterCaretPos = null;
        this.largeAmountLimit = 2; // If the data set is larger than this, than the filter will only start after enter key is pressed
        window.addEventListener('keyup', this.keyUp);
    }

    erase = () => {
        window.removeEventListener('keyup', this.keyUp);
    }

    paint = (data) => {
        if(data.showStats) {
            this.statsComp = this.addChild({
                id: this.id + '-stats',
                class: 'table-stats',
                text: getText('table_total_x_rows', [this.allData.length]),
            });
            this.statsComp.draw();
        }
        if(data.filter) {
            this._drawFilter();
        }
        const table = this._createTable();
        this.tableComp = this.addChild({ id: this.id + '-elem', template: table });
        this.tableComp.draw();
        this.addTableListeners();
    }

    addTableListeners = () => {
        for(let i=0; i<this.tableStructure.length; i++) {
            if(!this.tableStructure[i].unsortable) {
                this.tableComp.addListener({
                    id: this.tableStructure[i].key + '-sort-listener-acc',
                    target: document.getElementById(this.tableStructure[i].key + '-accessibility-sort-button'),
                    type: 'click',
                    fn: this._changeSortFN,
                });
                this.tableComp.addListener({
                    id: this.tableStructure[i].key + '-sort-listener',
                    target: document.getElementById(this.tableStructure[i].key + '-sort-header'),
                    type: 'click',
                    fn: this._changeSortFN,
                });
            }
        }
    }

    _changeSortFN = (e) => {
        e.preventDefault();
        const id = e.target.id;
        const targetKey = id.split('-')[0];
        let curDir = 'desc', newSortSet = false;
        for(let i=0; i<this.tableStructure.length; i++) {
            if(this.tableStructure[i].sort && targetKey !== this.tableStructure[i].key) {
                curDir = this.tableStructure[i].sort;
                this.tableStructure[i].sort = null;
                break;
            } else if(this.tableStructure[i].sort && targetKey === this.tableStructure[i].key) {
                // Only changing the sort direction, not the column
                this.tableStructure[i].sort === 'desc'
                    ? this.tableStructure[i].sort = 'asc'
                    : this.tableStructure[i].sort = 'desc';
                newSortSet = true;
                break;
            }
        }
        if(!newSortSet) {
            for(let i=0; i<this.tableStructure.length; i++) {
                if(targetKey === this.tableStructure[i].key) {
                    this.tableStructure[i].sort = curDir;
                    break;
                }
            }
        }
        this._refreshView();
    }

    _refreshView = () => {
        if(this.data.showStats) this.statsComp.discard(true);
        if(this.data.filter) this.filterComp.discard(true);
        this.tableComp.discard(true);
        this.rePaint();
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
        if(!this.tableData.length) {
            return this._emptyState();
        }
        let rows = '', sortByKey = '', asc = false;
        for(let i=0; i<this.tableStructure.length; i++) {
            if(this.tableStructure[i].sort) {
                sortByKey = this.tableStructure[i].key;
                if(this.tableStructure[i].sort === 'asc') asc = true;
                break;
            }
        }
        if(!sortByKey) {
            this.logger.error('Sorting key missing in table structure.');
            throw new Error('Call stack');
        }
        this.tableData.sort(this._sortCompare(sortByKey, asc));
        for(let i=0; i<this.tableData.length; i++) {
            rows += '<tr>';
            for(let j=0; j<this.tableStructure.length; j++) {
                rows += '<td' +
                    this._createRowClasses(this.tableStructure[j]) +
                    this._createRowStyle(this.tableStructure[j]) +
                '>';
                rows += this._rowNumberOnHover(i, j),
                rows += this._formatCellData(
                    this._getCellData(i, j),
                    j
                );
                rows += '</td>';
            }
            rows += '</tr>';
        }
        return `<tbody>${rows}</tbody>`;
    }

    _getCellData = (tableIndex, structIndex) => {
        const row = this.tableData[tableIndex];
        const key = this.tableStructure[structIndex].key;
        if(key === '_row-number') return tableIndex + 1;
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
            header += '<th';
            if(!this.tableStructure[i].unsortable) header += ` id="${this.tableStructure[i].key}-sort-header"`;
            header += this._createRowClasses(this.tableStructure[i], true) +
                this._createRowStyle(this.tableStructure[i]) +
            '>';
            header += this.tableStructure[i].heading
                ? this.tableStructure[i].heading
                : this.tableStructure[i].key;
            if(!this.tableStructure[i].unsortable) {
                header += `<button id="${this.tableStructure[i].key}-accessibility-sort-button" class="table-accessibility-sort">`;
                    header += `${getText('sort_by')} ${this.tableStructure[i].heading}`;
                header += '</button>';
            }
            header += '</th>';
        }
        header += '</tr></thead>';
        return header;
    }

    _createRowClasses = (structure, isHeader) => {
        let classes = structure.classes;
        let classString = '';
        if(typeof classes === 'string' || classes instanceof String) {
            if(structure.sort) classes += ' sort-column';
            classString = classes;
        } else {
            classes = [];
            if(structure.sort) classes.push('sort-column');
            let classList = '';
            for(let i=0; i<classes.length; i++) {
                if(!classList.length) {
                    classList = classes[i];
                } else {
                    classList += ' ' + classes[i];
                }
            }
            classString = classList;
        }
        if(isHeader) {
            if(!structure.unsortable) classString += ' sort-available';
            if(structure.sort) {
                if(structure.sort === 'asc') {
                    classString += ' sort-asc';
                } else {
                    classString += ' sort-desc';
                }
            }
        }
        if(structure.key === '_row-number') {
            classString += classString.length ? ' ' : '';
            classString += 'row-number-column';
        }
        return ' class="' + classString + '"';
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
        const type = this.tableStructure[structIndex].type;
        if(type) {
            if(type === 'Date') {
                if(!value || !value.length) return '';
                return createDate(value);
            }
        }

        return value;
    }

    _sortCompare(property, asc) {
        let dir = -1;
        if(asc) dir = 1;
        return (a, b) => {
            const splitProp = property.split('.');
            let aVal = a[splitProp[0]];
            let bVal = b[splitProp[0]];
            for(let i=1; i<splitProp.length; i++) {
                if(aVal) aVal = aVal[splitProp[i]];
                if(bVal) bVal = bVal[splitProp[i]];
            }
            if((typeof aVal === 'string' || aVal instanceof String) && (typeof bVal === 'string' || bVal instanceof String)) {
                if(aVal.toLowerCase() < bVal.toLowerCase()) return dir;
                if(aVal.toLowerCase() > bVal.toLowerCase()) return -1*dir;
            } else {
                if(aVal < bVal) return dir;
                if(aVal > bVal) return -1*dir;
            }
            return 0;
        }
    }

    _emptyState = () => {
        let oneRow = '<tr class="table-comp-empty-state">';
        oneRow += `<td colspan="${this.tableStructure.length}">`
        oneRow += this.data.emptyStateMsg
            ? this.data.emptyStateMsg
            : getText('table_no_rows_empty_state_text');
        oneRow += '</td></tr>';
        return `<tbody>${oneRow}</tbody>`;
    }

    _rowNumberOnHover = (rowIndex, structIndex) => {
        if((this.data.showRowNumbers !== 'hover' && this.data.showRowNumbers !== 'small') || structIndex !== 0) return '';
        return `<span class="table-${this.data.showRowNumbers}-row-number"># ${rowIndex+1}</span>`;
    }

    _drawFilter = () => {
        this.filterComp = this.addChild({
            id: this.id + '-filter-wrapper',
            class: 'table-filter-wrapper',
        });
        if(this.filterString.length) {
            this.filterComp.addChild(new Button({
                id: this.id + '-filter-clear',
                class: 'table-filter-clear',
                click: () => {
                    this.filterString = '';
                    this.filterCaretPos = null;
                    this._filterData();
                },
            }));
        }
        const input = new TextInput({
            id: this.id + '-filter-input',
            label: '',
            hideMsg: true,
            placeholder: getText('filter_placeholder'),
            value: this.filterString,
            changeFn: (e) => {
                const val = e.target.value;
                if(this.filterString === val) return;
                this.filterString = val;
                this.filterCaretPos = e.target.selectionStart;
                if(this.allData.length < this.largeAmountLimit) {
                    this._filterData();
                }
            },
        });
        this.filterComp.addChild(input);
        if(this.allData.length > this.largeAmountLimit) {
            this.filterComp.addChild({
                id: this.id + '-large-filter-info',
                class: 'table-large-filter-info',
                text: getText('press_enter_to_filter'),
            });
        }
        this.filterComp.draw();
        this.filterComp.drawChildren();

        if(this.filterCaretPos !== null) input.focus(this.filterCaretPos);
    }

    _filterData = () => {
        if(this.filterString === '') {
            this.tableData = [...this.allData];
            this._refreshView();
            return;
        }

        const newData = [];
        for(let i=0; i<this.allData.length; i++) {
            if(this.allData[i].username.toLowerCase().includes(this.filterString.toLowerCase())) {
                newData.push(this.allData[i]);
                continue;
            }
        }

        this.tableData = newData;
        this._refreshView();
    }

    keyUp = e => {
        const targetId = e.target.id;
        const filterInputId = this.id + '-filter-input-input';
        if(targetId === filterInputId && e.key === 'Enter') {
            this._filterData();
            if(this.allData.length < this.largeAmountLimit) {
                this.elem.querySelector('#'+filterInputId).blur();
            }
        } else if(e.key === 'Escape') {
            if(this.filterString === '' && this.filterCaretPos === null && e.target.id !== filterInputId) return;
            if(this.allData.length < this.largeAmountLimit) {
                this.filterString = '';
                this.filterCaretPos = null;
                this._filterData();
            }
            this.elem.querySelector('#'+filterInputId).blur();
        } else if(e.target.localName === 'body' && e.key === 'f') {
            this.elem.querySelector('#'+filterInputId).focus();
        }
    }
}

export default Table;