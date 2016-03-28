/**
 * Created by snekrasov on 17.06.2015.
 */
"use strict";
let list = require('../model/entityTemplates').List;

module.exports.entities = function (req, res, next) {
    list().then((item)=>
        res.json(item))
        .catch(next);
};