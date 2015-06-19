/**
 * Created by snekrasov on 18.06.2015.
 */
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

// Создаем обьект express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Отдаем статические файлы
app.use(express.static(path.resolve(__dirname, '../app/')));
app.use('/bower_components', express.static(path.resolve(__dirname, '../bower_components/')));


module .exports.app = app;