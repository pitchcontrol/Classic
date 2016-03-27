/**
 * Created by Станислав on 26.03.2016.
 */
"use strict";
var logger = require('./services/log').logger;

module.exports = function (err, req, res, next) {
    if (err instanceof Serialize.UniqueConstraintError) {
        logger.log('error', err.message);
        res.status(500).send("Параметры не уникальны");
    } else if (err instanceof authenticateError) {
        logger.log('warn', err.message);
        res.status(401).send(err.message);
    } else if (err instanceof notFound) {
        logger.log('warn', err.message);
        res.status(404).send(err.message);
    } else if (err instanceof Error) {
        logger.log('error', err.message);
        res.status(500).send('Ошибка');
    }
    next();
};