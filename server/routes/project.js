/**
 * Created by snekrasov on 03.07.2015.
 */
"use strict";
var winston = require('winston');
var util = require('util');
var project = require('./../model/project').Project;
var lodash = require('lodash-node');

module.exports.save = function (req, res, next) {
    var user = req.user;
    //Проверяем а есть ли такой проект
    project.findOne({where: {name: req.body.projectName, user_id: user.id}}).then((prj) => {
        if (prj) {
            winston.warn('Такой проект уже есть: ' + req.body.projectName + ',' + prj);
            return res.json({error: 'Такой проект уже есть: ' + req.body.projectName});
        }
        else {
            let obj = req.body;
            let prj = project.build({
                name: obj.projectName,
                diagram: lodash.omit(obj, 'projectName'),
                user_id: user.id
            });
            prj.save().then(function () {
                winston.info('Успешно сохранен проект: ' + prj.id);
                return res.json({id: prj.id});
            }).catch(function (error) {
                winston.error('Ошибка сохранения проекта ' + error);
                return res.json({error: 'Ошибка сохранения проекта'});
            });
        }
    });
};

module.exports.update = function (req, res, next) {
    var user = req.user;
    //Проверяем а есть ли такой проект
    project.findOne({where: {user_id: user.id, id: req.body.id}}).then((prj) => {
        if (prj) {
            winston.info('Обновляем проект, проект найден ид: ' + req.body.id + ', название: ' + prj.name);
            //Если меняем имя нужно проверить что бы небыло, повторений имен
            if (prj.name != req.body.projectName) {
                project.findOne({
                    where: {
                        name: req.body.projectName,
                        user_id: user.id,
                        id: {$ne: req.body.id}
                    }
                }).then((sp)=> {
                    if (sp) {
                        return res.json({error: 'Уже есть такой проект'});
                    } else {
                        prj.name = req.body.projectName;
                        prj.diagram = lodash.omit(req.body, 'projectName');
                        prj.save().then(function () {
                            winston.info('Успешно обновлен проект: ' + prj.id);
                            return res.json({id: prj.id});
                        }).catch(function (error) {
                            winston.error('Ошибка обновления проекта ' + error);
                            return res.json({error: 'Ошибка обновления проекта'});
                        });
                    }
                });
            } else {
                prj.name = req.body.projectName;
                prj.diagram = lodash.omit(req.body, 'projectName');
                prj.save().then(function () {
                    winston.info('Успешно обновлен проект: ' + prj.id);
                    return res.json({id: prj.id});
                }).catch(function (error) {
                    winston.error('Ошибка обновления проекта ' + error);
                    return res.json({error: 'Ошибка обновления проекта'});
                });
            }
        }
        else {
            winston.error('Попытка обновить проект: ' + req.body.id + ', проект не найден');
            return res.json({error: 'Проект не найден'});
        }
    }).catch(function (error) {
        winston.error('Ошибка обновления проекта, поиск проекта ' + error);
        return res.json({error: 'Ошибка обновления проекта'});
    });
};
module.exports.list = function (req, res, next) {
    var user = req.user;
    project.findAll({where: {user_id: user.id}}).then((prj)=> {
        winston.info('Полученны проекты для : ' + user.id);
        return res.json(prj);
    });
};
module.exports.load = function (req, res, next) {
    var user = req.user;
    var id = req.params.id;
    project.findOne({where: {user_id: user.id, id: id}}).then((prj)=> {
        winston.info('Получен проект ид: ' + id);
        return res.json(prj);
    });
};
module.exports.delete = function (req, res, next) {
    var user = req.user;
    var id = req.params.id;
    project.findOne({where: {user_id: user.id, id: id}}).then((prj)=> {
        if (prj != null) {
            winston.info('Получен проект для удаления ид: ' + id);
            prj.destroy().then(()=> {
                winston.info('Проект удален: ' + id);
                return res.json({});
            });
        }
        else {
            winston.error('Попытка удалить проект: ' + id + ', проект не найден');
            return res.json({error: 'Проект не найден'});
        }
    });
};