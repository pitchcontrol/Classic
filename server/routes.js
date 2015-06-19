"use strict";
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

    app.get('*', function (req, res, next) {
        res.status(404).send('Not found');
    });
};