/**
 * Created by snekrasov on 18.06.2015.
 */
"use strict";
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    argv = require('optimist').argv;

// Создаем обьект express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
if (argv.release) {
    app.use(express.static(path.resolve(__dirname, '../../dist')));
    app.use('/dist',express.static(path.resolve(__dirname, '../../dist')));
} else {
//Отдаем статические файлы
    app.use(express.static(path.resolve(__dirname, '../../app/')));
    app.use('/bower_components', express.static(path.resolve(__dirname, '../../bower_components/')));
}

module.exports.app = app;