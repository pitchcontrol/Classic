/**
 * Created by snekrasov on 05.06.2015.
 */
"use strict";
let Sequelize = require('sequelize');
let sq = require('../services/db').sequelize;

let entityTemplates = sq.define('entityTemplates', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    name: Sequelize.STRING,
    description: Sequelize.STRING
});
let entityTemplateFields = sq.define('fields', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    name: Sequelize.STRING,
    type: Sequelize.ENUM('string', 'integer', 'long', 'char', 'decimal', 'double', 'bool', 'enum', 'float', 'byte', 'guid', 'Association')
}, {
    tableName: 'entityTemplateFields'
});
//Добавляем связь один ко многим
entityTemplates.hasMany(entityTemplateFields, {foreignKey: {name: 'entityTemplates_id'}});

module.exports.EntityTemplates = entityTemplates;
module.exports.EntityTemplateFields = entityTemplateFields;

module.exports.List = function () {
    return entityTemplates.findAll({
        include: [{
            model: entityTemplateFields,
            attributes: ['name', 'type']
        }]
    });
};