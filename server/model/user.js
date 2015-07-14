/**
 * Created by snekrasov on 05.06.2015.
 */
"use strict";
var Serialize = require('sequelize');
var sq = require('../services/db').sequelize;
var project = require('./project').Project;

let user = sq.define('users', {
    id: {type: Serialize.INTEGER, primaryKey: true},
    login: Serialize.STRING,
    hash: Serialize.STRING
});

//Внешние ключи
user.hasMany(project, {foreignKey: {name: 'user_id'}});


module.exports.User = user;
