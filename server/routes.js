"use strict";
var winston = require('winston');
var jwt = require('express-jwt');
var config = require('./config.json');

module.exports.setup = function (app) {
    //Список шаблонов генератора
    app.get('/template/list', require('./routes/template').list);
    //Получить вопросы для шаблона
    app.get('/template/questions/:id', require('./routes/template').questions);
    //Выполнить
    app.post('/template/execute', require('./routes/template').execute);
    //Получить шаблоны готовых сущности
    app.get('/entities/list',require('./routes/entities').entities);
    //Аунтефикация
    app.post('/login', require('./services/authenticate').login);
    //Сохранение диаграммы
    app.post('/project/save', jwt({secret: config.salt}), require('./routes/project').save);
    //Обновить проект
    app.post('/project/update', jwt({secret: config.salt}), require('./routes/project').update);
    //Получить проекты для пользователя
    app.get('/project/list', jwt({secret: config.salt}), require('./routes/project').list);
    //Загрузить проект
    app.get('/project/load/:id', jwt({secret: config.salt}), require('./routes/project').load);

    app.get('*', function (req, res, next) {
        winston.warn(req.url+ ', Not found');
        res.status(404).send('Not found');
    });
};