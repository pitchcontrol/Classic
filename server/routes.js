"use strict";
var winston = require('winston');
var jwt = require('express-jwt');
var config = require('./config.json');

module.exports.setup = function (app) {
    //Список шаблонов генератора
    app.get('/template/list', require('./routes/template').list);
    //Получить список языков програмирования которые есть в шаблонах
    app.get('/languages/list', require('./routes/language').list);
    //Получить вопросы для шаблона
    app.get('/template/questions/:id', require('./routes/template').questions);
    //Выполнить
    app.post('/template/execute', require('./routes/template').execute);
    //Добавить шаблон
    app.post('/template/add', jwt({secret: config.salt}), require('./routes/template').add);
    //Получить шаблоны готовых сущности
    app.get('/entities/list', require('./routes/entities').entities);
    //Аунтефикация
    app.post('/login', require('./services/authenticate').login);
    //Регистрация
    app.post('/signup', require('./services/authenticate').signup);
    //Сохранение диаграммы
    app.post('/project/save', jwt({secret: config.salt}), require('./routes/project').save);
    //Обновить проект
    app.post('/project/update', jwt({secret: config.salt}), require('./routes/project').update);
    //Получить проекты для пользователя
    app.get('/project/list', jwt({secret: config.salt}), require('./routes/project').list);
    //Загрузить проект
    app.get('/project/load/:id', jwt({secret: config.salt}), require('./routes/project').load);
    //Удалить проекты
    app.get('/project/delete/:id', jwt({secret: config.salt}), require('./routes/project').delete);
    app.get('*', function (req, res, next) {
        let error = new Error('Not found');
        error.status = 404;
        next(error);
    });
};