/**
 * Created by snekrasov on 05.06.2015.
 */
"use strict";
let winston = require('winston');
let user = require('../model/user').User;
let bcrypt = require('bcrypt-nodejs');
let expressJwt = require('../../node_modules/express-jwt');
let jwt = require('jsonwebtoken');
let config = require('../config.json');
let async = require('async');
let auth = require('../errors/authenticateError');

module.exports.login = function (req, res, next) {
    var login = req.body.login || '';
    var password = req.body.password || '';

    if (login == '' || password == '') {
        return next(new auth.authenticateError('Не указан логин или пароль'));
    }
    user.findOne({where: {login: login}}).then((user) => {
        if (!user) {
            return next(new auth.authenticateError('Логин не найден: ' + login));
        }

        bcrypt.compare(password, user.hash, (err, r)=> {
            if (err) throw err;
            if (!r) {
                return next(new auth.authenticateError('Не верный пароль'));
            }
            let token = jwt.sign({login: login, id: user.id}, config.salt, {expiresInMinutes: 60});
            winston.info('Пользователь вошел: ' + login);
            return res.json({token: token, login: login});
        });

    }).catch(function (error) {
        winston.error(error);
        return res.status(500).send('Ошибка');
    });
};
module.exports.signup = function (req, res, next) {
    var login = req.body.login || '';
    var password = req.body.password || '';

    if (login == '' || password == '') {
        return next(new auth.authenticateError('Не указан логин или пароль'));
    }
    user.findOne({where: {login: login}}).then((data) => {
        if (data) {
            return next(new auth.authenticateError('Такой логин уже есть: ' + login));
        }

        async.waterfall([
                (callback) => bcrypt.genSalt(10, callback),
                (salt, callback)=> bcrypt.hash(password, salt, null, callback)
            ],
            function (err, hash) {
                if (err) throw err;
                let usr = user.build({
                    login: login,
                    hash: hash
                });
                usr.save().then(()=> {
                    let token = jwt.sign({login: login, id: usr.id}, config.salt, {expiresInMinutes: 60});
                    winston.info('Пользователь зарегистрировался: ' + login);
                    return res.json({token: token, login: login});
                }).catch(next);
            }
        );
    }).catch(next);
};