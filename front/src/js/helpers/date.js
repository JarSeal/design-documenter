import { Logger } from "../LIGHTER";
import { getText } from "./lang";

const formDateStringBase = (dateData) => {

};

const createDate = (dateData, args) => {
    let dateString = '';
    if(args) {
        if(args.hideTime) {
            if(args.showSeconds) {

            }
            if(args.showMilliseconds) {
    
            }
        }
        if(args.showOnlyYear) {

        }
    }
};

const getMonthName = (monthNumber, long) => {
    if(monthNumber < 1 || monthNumber > 12) {
        new Logger('Date, getMonthName *****').log('Month number is not withing 1 and 12.', month);
        return '';
    }
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let type = '_short';
    if(long) type = '_long';
    return getText('month_'+months[monthNumber-1]+type);
};

const getWeekDayName = (weekDayIndex, long) => {
    if(weekDayIndex < 0 || weekDayIndex > 6) {
        new Logger('Date, getWeekDayIndex *****').log('Month number is not withing 1 and 12.', month);
        return '';
    }
};