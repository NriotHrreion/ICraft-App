class Log {
    static info(text, ...data) {
        var time = new Date();
        console.log(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}][Log] ${text}`, data.length > 0 ? data[0] : "");
    }

    static warn(text) {
        var time = new Date();
        console.warn(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}][WARN] ${text}`);
    }

    static error(text) {
        var time = new Date();
        console.error(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}][ERROR] ${text}`);
    }
}
