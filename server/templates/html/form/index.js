/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let Builder = require('../../../services/boilerplateBuilder').builder;
let format = require('string-format');
module.exports.quetions = [
    {question: "Тип базы", type: "enum", choices: ["mysql", "mariadb", "sqlite", "postgres", "mssql"]},
    {question: "Разделитель внешнего ключа", type: "string"}
];

function getRaw(field, answers) {
    var tp = 'text';
    var isRequired = field.isRequired ? ' required ' : '';
    switch (field.type) {
        case 'integer':
        case 'long':
            tp = 'number';
            break;
        case 'guid':
            tp = 'text';
            break;
        case 'bool':
            tp = 'checkbox';
            break;
        case 'datetime':
            tp = 'datetime';
            break;
        case 'enum':
            let builder = new Builder({
                markEnd: '\r\n'
            });
            builder.writeLine("<select  id='{0}_'></select>", field.name);
            builder.getFieldBuilder()
                .writeLine("<option value='{0}'>{0}</option>")
                .build(field.values);
            return builder.result;
            break;
        case 'Association':

            break;
    }
    return format("<input id='{0}_' type='{1}'{2}>", field.name, tp, isRequired);
}
module.exports.render = function (data, callback) {
    try {
        let builder = new Builder({
            markEnd: '\r\n'
        });
        let renderFiles = [];
        data.entities.forEach((entity)=> {
            builder.writeLine("<form action='#'>");
            builder.getFieldBuilder()
                .writeLine("<label for='{name}_'></label><input id='{name}_' type='{rawType}'>");
            builder.writeLine("<input type='submit' value='submit'>");
            builder.writeLine("</form>");

        });
        callback(null, renderFiles);
    }
    catch (error) {
        callback(error);
    }
};