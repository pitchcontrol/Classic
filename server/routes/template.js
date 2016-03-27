/**
 * Created by snekrasov on 18.06.2015.
 */
"use strict";
var generator = require('../model/generator').Generator;
var questions = require('../model/generator').questionsForGenerator;
var lodash = require('lodash-node');
var choice = require('../model/generator').Choice;
var zip = require('../services/zipper');
var winston = require('winston');
//var log = require("../services/log")(module);
var util = require('util');
var rest = require('../services/rest').init(generator);
var notFound = require('../errors/notFoundError').notFoundError;
let auth = require('../errors/authenticateError').authenticateError;

module.exports.list = rest.list;

module.exports.add = rest.add;

//module.exports.addNew = function (req, res, next) {
//    let obj = req.body;
//    //generator.findOne({where: {name: obj.name}}).then(function (item) {
//    //    if (item != null) {
//    //        return res.send(log.warn('Шаблон c именем:{0} уже есть', obj.name));
//    //    }
//    let template = generator.build(obj);
//    template.save().then(function () {
//        log.info('Успешно сохранен шаблон: {0}', obj.name);
//        return res.json({id: template.id});
//    }).catch(function (error) {
//            next(error);
//            //if (/SequelizeUniqueConstraintError/.test(error)) {
//            //    return res.status(500).send(log.warn('Шаблон c именем:{0} уже есть', obj.name));
//            //}
//            //log.error(error);
//            //res.status(500).send('Ошибка сохранения шаблона');
//        }
//    );
//    //}).catch(log.errorLogger(res));
//};
module.exports.questions = function (req, res, next) {
    generator.findById(req.params.id).then(function (item) {
        if (item == null) {
            //return res.send(log.warn('Шаблон c id:{0} не найден', req.params.id));
            return next(new notFound(`Шаблон c id:${req.params.id} не найден`));
        }
        res.json(require(item.module).quetions);
    }).catch(next);
};
module.exports.execute = function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    generator.findById(req.body.id).then((item) => {
        if (item == null) {
            //res.status(404).send(log.warn('Шаблон c id:{0} не найден', req.body.id));
            //return;
            return next(new notFound(`Шаблон c id:${req.body.id} не найден`));
        }
        var md = require(item.module);
        md.render(req.body, (err, files)=> {
            if (err) {
                //log.error("Ошибка выполнения шаблона: {0}", err);
                //return res.status(500).send('Ошибка');
                return next(err);
            }
            zip.pack(files, res);
        });

    }).catch(next);
};