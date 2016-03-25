/**
 * Created by snekrasov on 18.09.2015.
 */
"use strict";
let log = require("../services/log").logger;

module.exports.init = function (context) {

    return {
        add: (req, res, next) => {
            let obj = req.body;
            let newObj = context.build(obj);
            newObj.save().then(function () {
                log.info('Успешно сохранен обьет типа: '+ newObj.$Model.name);
                return res.json({id: newObj.id});
            }).catch((error)=>next(error));
        },
        list: (req, res, next) => {
            context.findAll().then((items) => {
                res.json(items);
            }).catch((error)=>next(error));
        }
    };
};