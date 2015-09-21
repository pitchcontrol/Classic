var winston = require('winston'),
    app = require('./services/expressInit').app;
var Serialize = require('sequelize');
config = require('./config.json');

// Файл с роутам
var routes = require('./routes');
// Связуем с Routes
routes.setup(app);
// Если же произошла иная ошибка то отдаем 500 Internal Server Error
app.use(function (err, req, res, next) {
    if (err instanceof Serialize.UniqueConstraintError) {
        winston.log('error', err.message);
        res.status(500).send("Параметры не уникальны");
    } else if (err instanceof Error) {
        winston.log('error', err.message);
        res.status(err.status).send(res.message);
    }
    next();
});
//Неизвестная ошибка
app.use(function (err, req, res, next){
    winston.log('error', 'Неизвестная ошибка');
    res.status(500).send('Неизвестная ошибка');
});
app.listen(config.port || 8080);
//console.log(path.resolve(__dirname,'../app/'));
winston.info('Старт сервера');