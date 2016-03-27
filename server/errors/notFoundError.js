/**
 * Created by snekrasov on 25.03.2016.
 */
"use strict";
let util = require('util');
/**
 * Создает экземпляр NotFoundError
 * @constructor
 * @param message - Текст ошибки
 */
function NotFoundError(message) {
    this.message = message;
    this.status = 404;
}
util.inherits(NotFoundError, Error);

module.exports.notFoundError = NotFoundError;