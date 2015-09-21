/**
 * Created by snekrasov on 17.09.2015.
 */
"use strict";
let winston = require('winston');
let path = require('path');
let format = require('string-format');


module.exports = function (mod) {
    return makeLog(path.basename(mod.filename));
};
function writeLog(level, path) {
    return function () {
        let str = format.apply(this, arguments);
        winston.log(level, "[" + path + "] " + str);
        return str;
    };
}
function makeLog(path) {
    return {
        info: writeLog('info', path),
        warn: writeLog('warn', path),
        error: writeLog('error', path),
        errorLogger: function (res, message) {
            return function (error) {
                let text = message || 'Ошибка';
                writeLog('error', path)(text + error);
                return res.status(500).send(text);
            }
        }
    }
}