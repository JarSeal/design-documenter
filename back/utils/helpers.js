const ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = (id) => {
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
};

const createNewEditedArray = (oldEdited, editorId) => {
    const maxEditedLogs = 10; // TODO: Make this into a setting
    const edited = oldEdited || [];
    let newEdited = [];
    if(edited.length >= maxEditedLogs) {
        const startIndex = edited.length - maxEditedLogs + 1;
        for(let i=startIndex; i<edited.length; i++) {
            newEdited.push(edited[i]);
        }
    } else {
        newEdited = edited;
    }
    newEdited.push({
        by: ObjectId(editorId),
        date: new Date(),
    });
    return newEdited;
};

const createNewLoginLogsArray = (oldLogs, newLog) => {
    const maxDatesLogs = 10; // TODO: Make this into a setting
    const logs = oldLogs || [];
    let newLogs = [];
    if(logs.length >= maxDatesLogs) {
        const startIndex = logs.length - maxDatesLogs + 1;
        for(let i=startIndex; i<logs.length; i++) {
            newLogs.push(logs[i]);
        }
    } else {
        newLogs = logs;
    }
    newLogs.push(newLog);
    return newLogs;
};

module.exports = {
    isValidObjectId,
    createNewEditedArray,
    createNewLoginLogsArray,
};