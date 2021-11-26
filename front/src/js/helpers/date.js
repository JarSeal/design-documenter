import { Logger } from "../LIGHTER";
import { getText } from "./lang";

const variables = {
    defaultTimeDiff: '+08:00', // From UTC
    defaultFormat: {
        // Keywords:
        // - 0D and 0M = day or month number with a leading zero,
        // - DD and MM = day or month number without a leading zero,
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

const parseDateFormat = (dateData, shape) => {
    let format = variables.defaultFormat.full;
    if(shape) format = shape;

    // Date
    if(format.includes('DD')) format.replace('DD', dateData.getDate());
    if(format.includes('0D')) dateData.getDate() < 10
        ? '0' + format.replace('0D', dateData.getDate())
        : format.replace('0D', dateData.getDate());
    if(format.includes('DTH')) {
        const date = dateData.getDate();
        let suffix = getData('order_number_suffix_th');
        if(date === 1) { suffix = getData('order_number_suffix_st'); }
        else if(date === 2) { suffix = getData('order_number_suffix_nd'); }
        else if(date === 3) { suffix = getData('order_number_suffix_rd'); }
        format.replace('DTH', date + suffix);
    }

    // Month
    
};

export const createDate = (dateData, args) => {
    if(!dateData) return '';
    const newDate = new Date(dateData.toString().replace('Z', variables.defaultTimeDiff));
    return parseDateFormat(newDate);
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