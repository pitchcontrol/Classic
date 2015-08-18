/**
 * Created by snekrasov on 26.05.2015.
 */
"use strict";
var ejs = require('ejs'),
    fs = require('fs'),
    async = require('async'),
    Builder = require('../../../services/boilerplateBuilder').builder,
    util = require('util');
//Получит тип NET
function getType(field, answers) {
    var tp = 'string';
    switch (field.type) {
        case 'integer':
            tp = 'int';
            break;
        case 'guid':
            tp = 'Guid';
            break;
        case 'datetime':
            tp = 'Datetime';
            break;
        case 'enum':
            tp = field.enum;
            break;
        case 'Association':
            var name = answers[1] ? ('I' + field.associationObj.start.name) : field.associationObj.start.name;
            if (field.associationObj.multiplicity) {
                tp = util.format('%s<%s>', answers[2], name);
            } else {
                tp = name;
            }
            //console.log(name, tp);
            break;
        default :
            tp = field.type;
    }
    return tp;
}
module.exports.quetions = [
    {question: "Пространство имен", type: "string"},
    {question: "Нужно ли выделять интерфейсы", type: "bool"},
    {question: "Как представлять колекций", type: "enum", choices: ["List", "ICollection", "IEnumerable"]}
];
module.exports.render = function (data, callback) {
    var namespace = data.answers[0];
    var renderFiles = [];

    let builder = new Builder({
        openBrace: "{\r\n",
        closeBrace: '}\r\n',
        markEnd: '\r\n'
    });

    //Перебор сущностей
    data.entities.forEach(function (entity) {
        builder.result = '';
        //Формируем поля
        entity.fields.forEach(function (field, index, array) {
            field.rawType = getType(field, data.answers);
        });

        builder.writeLineOpenBrace('namespace {0}', namespace);
        //Если стоит выделить интерфейс - то нужно добавить наследлвание от него
        if (data.answers[1])
            builder.writeLineOpenBrace('public class {0}: I{0}', entity.name);
        else {
            builder.writeLineOpenBrace('public class {0}', entity.name);
        }
        builder.getFieldBuilder()
            .commentLine("/// <summary>")
            .commentLine("/// {description}")
            .commentLine("/// </summary>")
            .writeLine("public {rawType} {name} {{ get; set; }}")
            .build(entity.fields);
        builder.closeAllBraces();
        //var result = ejs.render(text, {item: cpItem, namespace: namespace});
        renderFiles.push({name: entity.name + ".cs", text: builder.result});
        //Если стоит условие выделять интерфейсы, добавляем интерфейсы
        if (data.answers[1]) {
            builder.result = '';
            //cpItem = Object.create(entity);
            builder.writeLineOpenBrace('namespace {0}', namespace);
            builder.writeLineOpenBrace('public interface I{0}', entity.name);
            builder.getFieldBuilder()
                .writeLine("{rawType} {name} {{ get; set; }}")
                .build(entity.fields);
            builder.closeAllBraces();
            renderFiles.push({name: "I" + entity.name + ".cs", text: builder.result});
        }
    });
    //Если есть enun надо создать файлы
    if (data.enums)
        data.enums.forEach((e)=> {
            builder.result = '';
            builder.writeLineOpenBrace('namespace {0}', namespace);
            builder.writeLineOpenBrace('public enum {0}', e.name);
            builder.getFieldBuilder(',\r\n')
                .writeLine("{0}")
                .build(e.values);
            builder.closeAllBraces();
            renderFiles.push({name: e.name + ".cs", text: builder.result});
        });
    callback(null, renderFiles);
};