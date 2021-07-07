const chalk = require("chalk");
const nLogger = require("nriot-logger");

nLogger.config({
    pattern: "[{time}][{type}] $ {text}"
});

module.exports = {
    info: function(text) {
        nLogger.info(text);
    },
    message: function(playerName, text) {
        nLogger.info(`[${chalk.yellow(playerName)}] ${text}`);
    },
    error: function(text) {
        nLogger.error(text);
    }
};
