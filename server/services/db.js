/**
 * Created by snekrasov on 02.06.2015.
 */
var config = require('../config.json');
var Sequelize = require('sequelize');
var argv = require('optimist').argv;

var login = argv.release ? config.database.release.login : config.database.debug.login;
var password = argv.release ? config.database.release.password : config.database.debug.password;
var name = argv.release ? config.database.release.name : config.database.debug.name;
var host = argv.release ? config.database.release.host : config.database.debug.host;

var sequelize = new Sequelize(name, login, password, {
    host: host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
module.exports.sequelize = sequelize;
