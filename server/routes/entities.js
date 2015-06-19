/**
 * Created by snekrasov on 17.06.2015.
 */
"use strict";
let winston = require('winston');
let list = require('../model/entityTemplates').List;

module.exports.entities = function (req, res) {
    list().then((item)=>
        res.json(item))
        .catch(function (error) {
            winston.error(error);
        });
};