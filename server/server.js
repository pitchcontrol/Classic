"use strict";

var winston = require('winston'),
    app = require('./services/expressInit').app;
var Serialize = require('sequelize');
var config = require('./config.json');
var argv = require('optimist').argv;
var authenticateError = require('./errors/authenticateError');
var logger = require('./server').logger;

// Файл с роутам
var routes = require('./routes');
// Связуем с Routes
routes.setup(app);
// Если же произошла иная ошибка то отдаем 500 Internal Server Error
app.use(function (err, req, res, next) {
    if (err instanceof Serialize.UniqueConstraintError) {
        logger.log('error', err.message);
        res.status(500).send("Параметры не уникальны");
    } else if (err instanceof authenticateError.authenticateError) {
        logger.log('warn', err.message);
        res.status(401).send(err.message);
    } else if (err instanceof Error) {
        logger.log('error', err.message);
        res.status(500).send('Ошибка');
    }
    next();
});
//Неизвестная ошибка
app.use(function (err, req, res, next) {
    winston.log('error', 'Неизвестная ошибка');
    res.status(500).send('Неизвестная ошибка');
});
app.listen(config.port || 8080);
//console.log(path.resolve(__dirname,'../app/'));
winston.info('Старт сервера в режиме: ' + argv.release ? 'Бой' : 'Отладка');