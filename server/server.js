"use strict";
var app = require('./services/expressInit').app;
var config = require('./config.json');
var argv = require('optimist').argv;
var authenticateError = require('./errors/authenticateError').authenticateError;
var logger = require('./services/log').logger;
var errorProcessor = require('./errorProcessor');

// Файл с роутам
var routes = require('./routes');
// Связуем с Routes
routes.setup(app);
//Обработка ошибок
app.use(errorProcessor);
//Неизвестная ошибка
app.use(function (err, req, res, next) {
    logger.log('error', 'Неизвестная ошибка');
    res.status(500).send('Неизвестная ошибка');
});
app.listen(config.port || 8080);
//console.log(path.resolve(__dirname,'../app/'));
logger.info('Старт сервера в режиме: ' + argv.release ? 'Бой' : 'Отладка');