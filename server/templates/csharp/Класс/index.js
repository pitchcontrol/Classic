/**
 * Created by snekrasov on 26.05.2015.
 */
"use strict";
var ejs = require('ejs'),
    fs = require('fs'),
    async = require('async'),
    Builder = require('../../../services/boilerplateBuilder'),
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
    {
        question: "Как представлять колекций",
        type: "enum",
        choices: ["List", "ICollection", "IEnumerable"],
        default: "ICollection"
    }
];
module.exports.render = function (data, callback) {
    let namespace = data.answers[0];
    let extractInterfaces = data.answers[1];
    let renderFiles = [];

    data.entities.forEach((entity)=> {
        entity.namespace = namespace;
        entity.fields.forEach((f)=> {
            f.rawType = getType(f, data.answers);
        });
    });

    let csharpBuilder = Builder.getChsarpBuilder();
    csharpBuilder.writeLineOpenBrace('namespace {namespace}');
    //Если стоит выделить интерфейс - то нужно добавить наследлвание от него
    if (data.answers[1])
        csharpBuilder.writeLineOpenBrace('public class {name}: I{name}');
    else {
        csharpBuilder.writeLineOpenBrace('public class {name}');
    }
    csharpBuilder.getBuilder()
        .commentLine("/// <summary>")
        .commentLine("/// {description}")
        .commentLine("/// </summary>")
        .writeLine("public {rawType} {name} {{ get; set; }}")
        .sheduleBuild("fields");
    csharpBuilder.closeAllBraces();
    //var result = ejs.render(text, {item: cpItem, namespace: namespace});
    renderFiles = csharpBuilder.build(data.entities, true);

    //renderFiles.push({name: entity.name + ".cs", text: builder.result});
    //Если стоит условие выделять интерфейсы, добавляем интерфейсы
    if (extractInterfaces) {
        csharpBuilder = Builder.getChsarpBuilder();
        csharpBuilder.setFileNameFormat("I{name}.cs")
            .writeLineOpenBrace('namespace {namespace}')
            .writeLineOpenBrace('public interface I{name}')
            .getBuilder()
            .writeLine("{rawType} {name} {{ get; set; }}")
            .sheduleBuild("fields");
        csharpBuilder.closeAllBraces();
        csharpBuilder.build(data.entities, renderFiles);
        //renderFiles.push({name: "I" + entity.name + ".cs", text: builder.result});
    }

    //Если есть enun надо создать файлы
    if (data.enums && data.enums.length > 0) {
        data.enums.forEach((enu)=> {
            enu.namespace = namespace;
        });
        csharpBuilder = Builder.getChsarpBuilder();
        csharpBuilder.writeLineOpenBrace('namespace {namespace}');
        csharpBuilder.writeLineOpenBrace('public enum {name}');
        let builder = csharpBuilder.getBuilder();
        builder._builder.markEnd=',';
        builder.writeLine("{0}");
        builder.sheduleBuild("values");
        csharpBuilder.closeAllBraces();
        csharpBuilder.build(data.enums, renderFiles);
        //renderFiles.push({name: e.name + ".cs", text: builder.result});
    }
    callback(null, renderFiles);
};