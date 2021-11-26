import { Logger } from "../LIGHTER";
import { getText } from "./lang";

const formDateStringBase = (dateData) => {

};

const variables = {
    defaultTimeDiff: 2, // From UTC
    defaultFormat: {
        // Keywords:
        // - DD and MM = day or month number with a leading zero,
        // - D and M = day or month number without a leading zero,
        // - DTH = day number with st, nd, or th ending (or in other languages it could be a period)
        // - YYYY = full year (2021),
        // - YY = only decades (21),
        // - WD = full week day name (Monday),
        // - WDS = short week day name (Mon),
        // - MN = full month name (January),
        // - MNS = short month name (Jan),
        // Example: 'DTH MNS YYYY, HH:MM' = '6th Jan 2021, 10:25'
        date: 'D.M.YYYY',
        time: 'HH.MM',
        full: 'D.M.YYYY, HH:MM',
    }
};

export const createDate = (dateData, args) => {
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

export const getMonthName = (monthIndex, long) => {
    if(monthNumber < 1 || monthNumber > 12) {
        new Logger('Date, getMonthName *****').log('Month number is not withing 1 and 12.', month);
        return '';
    }
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let type = '_short';
    if(long) type = '_long';
    return getText('month_'+months[monthIndex]+type);
};

export const getWeekDayName = (weekDayIndex, long) => {
    if(weekDayIndex < 0 || weekDayIndex > 6) {
        new Logger('Date, getWeekDayIndex *****').log('Month number is not withing 1 and 12.', month);
        return '';
    }
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let type = '_short';
    if(long) type = '_long';
    return  getText('weekday_'+dayNames[weekDayIndex]+type);
};