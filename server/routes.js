var fs = require('fs');
var util = require('util');
var lodash = require('lodash-node');
var zip = require('./services/zipper');

module.exports.setup = function (app) {
    //Список шаблонов генератора
    app.get('/template/list', function (req, res, next) {

            var json = require('./templates/info.json');
            var result = json.map(function (item) {
                return {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "language": item.language
                }
            });
            res.json(result);
        }
    );
    //Получить вопросы для шаблона
    app.get('/template/questions/:id', function (req, res, next) {
        var json = require('./templates/info.json');
        var result = lodash.find(json, {'id': req.params.id});
        if (result == undefined) {
            res.send(404, util.format('Шаблон c id:%s не найден', req.params.id));
            return;
        }
        res.json(result.questions);
    });
    app.post('/template/execute', function (req, res) {
        if (!req.body) return res.sendStatus(400);

        var json = require('./templates/info.json');
        var result = lodash.find(json, {'id': req.body.id});

        if (!result) {
            res.status(404).send(util.format('Шаблон c id:%s не найден', req.params.id));
            return;
        }
        var md = require(result.module);
        var files = md.render(req.body);
        zip.pack(files, res);
    });
    //Получить шаблоны сущности
    app.get('/entities/list', function (req, res) {
        var json = require('../test/entityTemplates.json');
        res.json(json);
    });
    app.get('/code', function (req, res) {
        var files = [{
            name: "class.cs",
            text: "Hello world"
        }];
        zip.pack(files, res);
    });
    app.get('*', function (req, res, next) {
        res.status(404).send('Not found');
    });
};