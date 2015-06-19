var winston = require('winston'),
    app = require('./services/expressInit').app;
config = require('./config.json');

// Файл с роутам
var routes = require('./routes');
// Связуем с Routes
routes.setup(app);
// Если же произошла иная ошибка то отдаем 500 Internal Server Error
app.use(function (err, req, res, next) {
    winston.log('error', err.message);
    res.status(500).send(err);
});

app.listen(config.port || 8080);
//console.log(path.resolve(__dirname,'../app/'));
winston.info('Старт сервера');