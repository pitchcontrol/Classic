/**
 * Created by snekrasov on 05.06.2015.
 */
"use strict";
let winston = require('winston');
let user = require('../model/user').User;
let bcrypt = require('bcrypt');
let expressJwt = require('../../node_modules/express-jwt');
let jwt = require('jsonwebtoken');
let config = require('../config.json');

module.exports.login = function (req, res, next) {
    var login = req.body.login || '';
    var password = req.body.password || '';

    if (login == '' || password == '') {
        return res.status(401).send('Не указан логин или пароль');
    }

    user.findOne({where: {login: login}}).then((user) => {
        if (!user) {
            winston.warn('Логин не найден: ' + login);
            return res.status(401).send('Логин не найден: ' + login);
        }

        bcrypt.compare(password, user.hash, (err, r)=> {
            if (err) throw err;
            if (!r) {
                winston.warn("Attempt failed to login with " + login);
                return res.status(401).send("Не верный пароль");
            }
            let token = jwt.sign({login: login}, config.salt, {expiresInMinutes: 60});
            winston.info('Пользователь вошел: ' + login);
            return res.json({token: token, login: login});
        });

    }).catch(function (error) {
        winston.error(error);
    });
};