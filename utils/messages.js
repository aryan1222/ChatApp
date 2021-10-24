const moment = require('moment');

const formatMessage = (userName, message) =>{
    return {
        userName,
        message,
        time : moment().format('h:mm a')
    }
}

module.exports = formatMessage;