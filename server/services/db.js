/**
 * Created by snekrasov on 02.06.2015.
 */
var config = require('../config.json');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.database.name, config.database.login, config.database.password, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
module.exports.sequelize = sequelize;
