/**
 * Created by Станислав on 26.03.2016.
 */
"use strict";
var logger = require('./services/log').logger;
var Serialize = require('sequelize');
var authenticateError = require('./errors/authenticateError').authenticateError;
var notFound = require('./errors/notFoundError').notFoundError;

module.exports = function (err, req, res, next) {
    if (!err)
        next();
    let status = err.status || 500;

    if(status == 500){
        logger.log('error', err.message);
        res.status(500).send('Ошибка');
    }else{
        res.status(status).send(err.message);
    }
    //if (err instanceof Serialize.UniqueConstraintError) {
    //    logger.log('error', err.message);
    //    res.status(500).send("Параметры не уникальны");
    //} else if (err instanceof authenticateError) {
    //    logger.log('warn', err.message);
    //    res.status(401).send(err.message);
    //} else if (err instanceof notFound) {
    //    logger.log('warn', err.message);
    //    console.log('My error 404',err);
    //    res.status(404).send(err.message);
    //} else if (err instanceof Error) {
    //    logger.log('error', err.message);
    //    res.status(500).send('Ошибка');
    //}
    //next();
};