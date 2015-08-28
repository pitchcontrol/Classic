/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let Builder = require('../../../services/boilerplateBuilder');
let format = require('string-format');
let lodash = require('lodash-node');

module.exports.quetions = [
    {question: "Сформировать полную HTML страницу", type: "bool", default: false}
];

function getRaw(field, data) {
    var tp = 'text';
    var isRequired = field.isRequired ? ' required' : '';
    let builder;
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
            builder = Builder.getHtmlBuilder();
            builder.writeLineOpenBrace("<select  id='{0}_'>", field.name);
            builder.getFieldBuilder()
                .writeLine("<option value='{0}'>{0}</option>")
                .build(lodash.findWhere(data.enums, {name: field.enum}).values);
            builder.closeAllBraces();
            builder.write("</select>");
            return builder.result;
            break;
        case 'Association':

            break;
    }
    return format("<input id='{0}_' type='{1}'{2}>", field.name, tp, isRequired);
}
module.exports.render = function (data, callback) {
    try {
        let builder;
        let renderFiles = [];
        let fullPage = data.answers[0];

        data.entities.forEach((entity)=> {
            entity.fields.forEach((f)=> {
                getRaw(f, data);
            });
        });

        builder = Builder.getHtmlBuilder();
        if (fullPage) {
            builder.writeLine("<!DOCTYPE html>");
            builder.writeTagLine("html");
            builder.writeTagLine('head', 'lang="en"');
            builder.writeLine('<meta charset="UTF-8">');
            builder.writeLine('<title></title>');
            builder.closeLastTagLine();
            builder.writeTagLine("body");
        }
        builder.writeLineOpenBrace("<form action='#'>");
        builder.getBuilder().setFilter((fl)=> fl.type != 'Association')
            .writeLine("<label for='{name}_'></label>{rawType}")
            .sheduleBuild();
        builder.writeLine("<input type='submit' value='submit'>");
        builder.closeAllBraces();
        builder.writeLine("</form>");

        builder.closeAllTagsLine();
        callback(null, builder.build(data.entities, true));
    }
    catch (error) {
        callback(error);
    }
};