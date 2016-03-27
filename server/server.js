"use strict";

var winston = require('winston'),
    app = require('./services/expressInit').app;
var Serialize = require('sequelize');
var config = require('./config.json');
var argv = require('optimist').argv;
var authenticateError = require('./errors/authenticateError').authenticateError;
var notFound = require('./errors/notFoundError').notFoundError;
var logger = require('./server').logger;
var errorProcessor = require('./errorProcessor');

// Файл с роутам
var routes = require('./routes');
// Связуем с Routes
routes.setup(app);
//Обработка ошибок
app(errorProcessor);

//Неизвестная ошибка
app.use(function (err, req, res, next) {
    winston.log('error', 'Неизвестная ошибка');
    res.status(500).send('Неизвестная ошибка');
});
app.listen(config.port || 8080);
//console.log(path.resolve(__dirname,'../app/'));
winston.info('Старт сервера в режиме: ' + argv.release ? 'Бой' : 'Отладка');