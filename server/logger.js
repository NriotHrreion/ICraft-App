const chalk = require("chalk");

module.exports = {
    info: function(text) {
        var time = new Date();
        console.log(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] ${text}`);
    },
    message: function(playerName, text) {
        var time = new Date();
        console.log(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}][CHAT][${chalk.yellow(playerName)}] ${text}`);
    },
    error: function(text) {
        var time = new Date();
        console.log(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}][ERROR] ${chalk.red(text)}`);
    }
};
