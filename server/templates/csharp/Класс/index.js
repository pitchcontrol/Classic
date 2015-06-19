/**
 * Created by snekrasov on 26.05.2015.
 */
"use strict"
var ejs = require('ejs'),
    fs = require('fs'),
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

module.exports.render = function (data, path) {
    var renderFiles = [];
    var text = fs.readFileSync(path || __dirname + '/Класс.ejs', 'utf8');
    //Перебор сущностей
    data.entities.forEach(function (entity) {
        //Если стоит выделить интерфейс - то нужно добавить наследлвание от него
        var cpItem = Object.create(entity);
        if (data.answers[1]) {
            cpItem.name = cpItem.name + ': I' + cpItem.name;
        }
        cpItem.type = 'class';

        //Формируем поля
        cpItem.fields.forEach(function (field, index, array) {
            //console.log(cpItem.name, data.answers[1]);
            field.raw = function () {
                //Получим тип
                var type = getType(field, data.answers);
                return util.format('\tpublic %s %s { get; set; }', type, field.name, (index < array.length - 1) ? '\r\n' : '');
            };
        });
        var result = ejs.render(text, {item: cpItem, answers: data.answers});
        renderFiles.push({name: entity.name + ".cs", text: result});
        //Если стоит условие выделять интерфейсы, добавляем интерфейсы
        if (data.answers[1]) {
            cpItem = Object.create(entity);
            cpItem.name = 'I' + cpItem.name;
            cpItem.type = 'interface';
            result = ejs.render(text, {item: cpItem, answers: data.answers});
            renderFiles.push({name: entity + ".cs", text: result});
        }
    });

    return renderFiles;
};