/**
 * Created by snekrasov on 02.06.2015.
 */
"use strict";
var Sequelize = require('sequelize');
var sq = require('../services/db').sequelize;


let generator = sq.define('generator', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    module: Sequelize.STRING,
    language: Sequelize.ENUM('csharp', 'java','javascript','html')
});
let question = sq.define('questions', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    question: Sequelize.STRING,
    type: Sequelize.ENUM('string', 'bool', 'enum'),
    order: Sequelize.INTEGER
});
let choice = sq.define('choice', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    Choice: Sequelize.STRING
});
//Добавляем связь один ко многим
generator.hasMany(question, {foreignKey: {name: 'generator_id'}});
question.hasMany(choice, {foreignKey: {name: 'question_id'}});

module.exports.Generator = generator;
module.exports.Question = question;
module.exports.Choice = choice;

module.exports.questionsForGenerator = function (id) {
    return question.findAll({
        where: {generator_id: id},
        include: [{model: choice, attributes: ['choice']}],
        order: '"order" ASC'
    });
};