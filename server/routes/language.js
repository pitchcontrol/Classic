/**
 * Created by Станислав on 03.04.2016.
 */
"use strict";
//let generator = require('../model/generator').Generator;
let sequelize = require('../services/db').sequelize;

module.exports.list = function (req, res, next) {
    sequelize.query("select distinct language as name from generators", {type: sequelize.QueryTypes.SELECT})
        .then((result)=> res.json(result)).catch(next);
};