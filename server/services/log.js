/**
 * Created by snekrasov on 17.09.2015.
 */
"use strict";
let winston = require('winston');
let path = require('path');
let format = require('string-format');
let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info',
            maxsize: 5120
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error',
            maxsize: 5120
        })
    ]
});

module.exports.logger = logger;
//module.exports = function (mod) {
//    return makeLog(path.basename(mod.filename));
//};
//function writeLog(level, path) {
//    return function () {
//        let str = format.apply(this, arguments);
//        logger.log(level, "[" + path + "] " + str);
//        return str;
//    };
//}
//function makeLog(path) {
//    return {
//        info: writeLog('info', path),
//        warn: writeLog('warn', path),
//        error: writeLog('error', path),
//        errorLogger: function (res, message) {
//            return function (error) {
//                let text = message || 'Ошибка';
//                writeLog('error', path)(text + error);
//                return res.status(500).send(text);
//            }
//        }
//    }
//}