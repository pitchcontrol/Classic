/**
 * Created by snekrasov on 18.09.2015.
 */
"use strict";
let util = require('util');

function UniqueConstraintError(message) {
    this.message = message;
}
util.inherits(UniqueConstraintError, Error);

module.exports.uniqueConstraintError = UniqueConstraintError;