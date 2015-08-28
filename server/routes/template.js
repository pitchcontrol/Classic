/**
 * Created by snekrasov on 18.06.2015.
 */
var generator = require('../model/generator').Generator;
var questions = require('../model/generator').questionsForGenerator;
var lodash = require('lodash-node');
var choice = require('../model/generator').Choice;
var zip = require('../services/zipper');
var winston = require('winston');
var util = require('util');

module.exports.list = function (req, res) {
    generator.findAll().then(function (items) {
        res.json(items);
    });
};
module.exports.questions = function (req, res) {
    generator.findById(req.params.id).then(function (item) {
        if (item == null) {
            var mess = util.format('Шаблон c id:%s не найден', req.params.id);
            winston.warn(mess);
            res.send(mess);
            return;
        }
        res.json(require(item.module).quetions);
    }).catch(function (error) {
        winston.error(error);
        return res.status(500).send('Ошибка');
    });
};
module.exports.execute = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    generator.findById(req.body.id).then(function (item) {
        if (item == null) {
            var mess = util.format('Шаблон c id:%s не найден', req.body.id);
            winston.warn(mess);
            res.status(404).send(mess);
            return;
        }
        var md = require(item.module);
        md.render(req.body, (err, files)=> {
            if (err) {
                winston.error("Ошибка выполнения шаблона: " + err);
                return res.status(500).send('Ошибка');
            }
            zip.pack(files, res);
        });

    }).catch(function (error) {
        winston.error(error);
        return res.status(500).send('Ошибка');
    });
};