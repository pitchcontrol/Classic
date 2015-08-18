/**
 * Created by snekrasov on 17.07.2015.
 */
"use strict";
var ejs = require('ejs'),
    fs = require('fs'),
    util = require('util'),
    format = require('string-format'),
    async = require('async'),
    lodash = require('lodash-node');

//Получит тип Sequelize
function getType(field, answers) {
    var tp = 'Sequelize.STRING';
    switch (field.type) {
        case 'integer':
            tp = 'Sequelize.INTEGER';
            break;
        case 'guid':
            tp = 'Sequelize.UUID';
            break;
        case 'datetime':
            tp = 'Sequelize.DATE';
            break;
        case 'bool':
            tp = 'Sequelize.BOOLEAN';
            break;
        case 'Association':
            break;
        default :
            tp = 'Sequelize.STRING';
    }
    return tp;
}
//Получит строку подключения модуля
function getAssociation(field) {
    var external = field.associationObj.start.name;
    return util.format("var %s = require('./%s').%s;\r\n", external, external, external);
}
//Построить связи
function getRelation(field, answers, entities, entity) {
    var multiplicity = field.associationObj.multiplicity;
    var external = field.associationObj.start.name;
    //Ид во внешней сущности
    var ent = lodash.findWhere(entities, {name: external});
    //В найденной сущности находим первичный ключ
    var externalId = ent ? lodash.findWhere(ent.fields, {isPrimaryKey: true}) : null;
    externalId = externalId ? externalId.name : '';
    if (!multiplicity) {
        //Один к одному
        return format("{0}.hasOne({1}, {{foreignKey: {{name: '{0}{2}{3}'}}}});\r\n", entity.name, external, answers[1], externalId);
    } else {
        //Один ко многим
        return format("{0}.hasMany({1}, {{foreignKey: {{name: '{0}{2}{3}'}}}});\r\n", entity.name, external, answers[1], externalId);
    }
};
module.exports.quetions = [
    {question: "Тип базы", type: "enum", choices: ["mysql", "mariadb", "sqlite", "postgres", "mssql"]},
    {question: "Разделитель внешнего ключа", type: "string"}
];
//Вопросы
//0 Тип базы
//1 разделитель внешнего ключа "_"
module.exports.render = function (data, callback) {
    var renderFiles = [];
    async.parallel([
        function (call) {
            fs.readFile(__dirname + '/sequelize.ejs', 'utf8', call);
        },
        function (call) {
            fs.readFile(__dirname + '/sequelizeInit.ejs', 'utf8', call);
        }
    ], (err, results)=> {
        if (err)
            callback(err);
        var text = results[0];
        var initText = results[1];
        var raw = function (field, index, array) {
            var type = getType(field);
            var pk = field.isPrimaryKey ? ', primaryKey: true' : '';
            var allowNull = field.isRequired ? ', allowNull: false' : '';
            var res = '';
            //Если нет ни чего кроме типа то можно сокрашенный вариант
            if (!field.isRequired && !field.isPrimaryKey)
                return util.format('%s: %s,\r\n', field.name, type);
            else if (field.isPrimaryKey) {
                //Первичный ключ не может быть null
                return util.format('%s: {type: %s, primaryKey: true},\r\n', field.name, type);
            }
            return util.format('%s: {type: %s%s},\r\n', field.name, type, allowNull);
        };
        //Добавление модуля настроек
        var result = ejs.render(initText, {item: {type: data.answers[0]}});
        renderFiles.push({name: "init.js", text: result});

        //Перебираем сущности
        data.entities.forEach((entity)=> {
            //Поля сущности
            let fields = [];
            //Внешние связи - подключения модулей
            let external = [];
            //Хранятся связи
            let relations = [];
            entity.fields.forEach((field, index, array)=> {
                //Добавляем поле с типами и т.д.
                //При этом ассоциция будет отдельно
                if (field.type != 'Association')
                    fields.push(raw(field, index, array));
                else {
                    relations.push(getRelation(field, data.answers, data.entities, entity));
                    external.push(getAssociation(field));
                }
            });
            //Нужно у поледнего поля нужно убрать запятую
            var str = fields[fields.length - 1];
            if (str)
                fields[fields.length - 1] = str.replace(/,$/m, '\r\n');

            var result = ejs.render(text, {fields: fields, item: entity, external: external, relations: relations});
            renderFiles.push({name: entity.name + ".js", text: result});
        });
        callback(null, renderFiles);
    });
};
