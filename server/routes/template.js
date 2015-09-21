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
var log = require("../services/log")(module);
var util = require('util');
var rest = require('../services/rest').init(generator);

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
module.exports.questions = function (req, res) {
    generator.findById(req.params.id).then(function (item) {
        if (item == null) {
            return res.send(log.warn('Шаблон c id:{0} не найден', req.params.id));
        }
        res.json(require(item.module).quetions);
    }).catch(log.errorLogger(res));
};
module.exports.execute = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    generator.findById(req.body.id).then(function (item) {
        if (item == null) {
            res.status(404).send(log.warn('Шаблон c id:{0} не найден', req.body.id));
            return;
        }
        var md = require(item.module);
        md.render(req.body, (err, files)=> {
            if (err) {
                log.error("Ошибка выполнения шаблона: {0}", err);
                return res.status(500).send('Ошибка');
            }
            zip.pack(files, res);
        });

    }).catch(log.errorLogger(res));
};