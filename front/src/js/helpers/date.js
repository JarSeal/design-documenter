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
        // - MI = minutes with leading zeros,
        // - SS = seconds with leading zeros,
        // - MS = milliseconds
        // Example: 'DTH MNS YYYY, HH:MM' = '6th Jan 2021, 10:25'
        // TODO: create the am and pm time for hours and the two letter thing (am or pm)
        date: 'DD.MM.YYYY',
        time: 'HH.MM',
        full: 'DD.MM.YYYY, 0H:MI',
    }
};

const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const parseDateFormat = (dateData, shape) => {
    let format = variables.defaultFormat.full;
    if(shape) format = shape;

    // Date
    if(format.includes('DD')) format = format.replace('DD', dateData.getDate());
    if(format.includes('0D')) dateData.getDate() < 10
        ? format = format.replace('0D', '0'+dateData.getDate())
        : format = format.replace('0D', dateData.getDate());
    if(format.includes('DTH')) {
        const date = dateData.getDate();
        let suffix = getText('order_number_suffix_th');
        if(date === 1) { suffix = getText('order_number_suffix_st'); }
        else if(date === 2) { suffix = getText('order_number_suffix_nd'); }
        else if(date === 3) { suffix = getText('order_number_suffix_rd'); }
        format = format.replace('DTH', date + suffix);
    }

    // Week day name
    if(format.includes('WDS')) {
        format = format.replace('WDS', getText('weekday_'+dayNames[dateData.getDay()]+'_short'));
    }
    if(format.includes('WD')) {
        format = format.replace('WD', getText('weekday_'+dayNames[dateData.getDay()]+'_long'));
    }

    // Month
    if(format.includes('MM')) format = format.replace('MM', dateData.getMonth()+1);
    if(format.includes('0M')) dateData.getMonth()+1 < 10
        ? format = format.replace('0M', '0'+dateData.getMonth()+1)
        : format = format.replace('0M', dateData.getMonth()+1);
    
    // Month name
    if(format.includes('MNS')) {
        format = format.replace('MNS', getText('month_'+months[dateData.getMonth()]+'_short'));
    }
    if(format.includes('MN')) {
        format = format.replace('MN', getText('month_'+months[dateData.getMonth()]+'_long'));
    }

    // Year
    if(format.includes('YYYY')) format = format.replace('YYYY', dateData.getFullYear());
    if(format.includes('YY')) format = format.replace('YY', dateData.getFullYear().toString().slice(-2));

    // Hour
    if(format.includes('HH')) format = format.replace('HH', dateData.getHours());
    if(format.includes('0H')) dateData.getHours() < 10
        ? format = format.replace('0H', '0'+dateData.getHours())
        : format = format.replace('0H', dateData.getHours());

    // Minute
    if(format.includes('MI')) dateData.getMinutes() < 10
        ? format = format.replace('MI', '0'+dateData.getMinutes())
        : format = format.replace('MI', dateData.getMinutes());

    // Second
    if(format.includes('SS')) dateData.getSeconds() < 10
        ? format = format.replace('SS', '0'+dateData.getSeconds())
        : format = format.replace('SS', dateData.getSeconds());

    // Millisecond
    if(format.includes('MS')) format = format.replace('MS', dateData.getMilliseconds());
    
    return format;
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
    let type = '_short';
    if(long) type = '_long';
    return getText('month_'+months[monthIndex]+type);
};

export const getWeekDayName = (weekDayIndex, long) => {
    if(weekDayIndex < 0 || weekDayIndex > 6) {
        new Logger('Date, getWeekDayIndex *****').log('Month number is not withing 1 and 12.', month);
        return '';
    }
    let type = '_short';
    if(long) type = '_long';
    return  getText('weekday_'+dayNames[weekDayIndex]+type);
};