var express = require('express'),
    path = require('path'),
    winston = require('winston'),
    bodyParser = require('body-parser');

// Файл с роутам
var routes = require('./routes');

// Создаем обьект express
var app = express();
app.use(bodyParser.json());
//Отдаем статические файлы
app.use(express.static(path.resolve(__dirname,'../app/')));
//app.use('/app',express.static(path.resolve(__dirname,'../')));
app.use('/bower_components',express.static(path.resolve(__dirname,'../bower_components/')));

// Связуем с Routes
routes.setup(app);

// Если же произошла иная ошибка то отдаем 500 Internal Server Error
app.use(function (err, req, res, next) {
    winston.log('error', err.message);
    res.status(500).send(err);
});

app.listen(process.env.PORT || 8080);
//console.log(path.resolve(__dirname,'../app/'));
winston.info('Старт сервера');