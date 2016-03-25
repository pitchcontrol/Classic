/**
 * Created by snekrasov on 25.03.2016.
 */
"use strict";
let util = require('util');
/**
 * Создает экземпляр AuthenticateError
 * @constructor
 * @param message - Текст ошибки
 */
function AuthenticateError(message) {
    this.message = message;
    this.status = 401;
}
util.inherits(AuthenticateError, Error);

module.exports.authenticateError = AuthenticateError;