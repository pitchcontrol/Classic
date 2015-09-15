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
            field.enumValues = lodash.findWhere(data.enums, {name: field.enum}).values;
            break;
        case 'Association':

            break;
    }

    field.rawType = tp;
    field.isRequired = field.isRequired ? ' required' : '';

    return tp;//format("<input id='{0}_' type='{1}'{2}>", field.name, tp, isRequired);
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
        builder.writeTagLine("form","action='#'");
        let flBl = builder.getBuilder();
        flBl.setFilter((fl)=> fl.type != 'Association')
            .writeLine("<label for='{name}_'></label><input id='{name}_' type='{rawType}'{isRequired}>")
            .setCase("type", "enum")
            .writeLine("<label for='{name}_'></label>")
            .writeTagLine("select", "id='{name}_'")
            .getBuilder()
            .writeTagWithBodyLine("option", "value='{0}'", "{0}")
            .sheduleBuild("enumValues");
        flBl.closeAllTagsLine();
        flBl.sheduleBuild("fields");
        //Кнопка субмит
        builder.writeLine("<input type='submit' value='submit'>");
        builder.closeAllTagsLine();
        callback(null, builder.build(data.entities, true));
    }
    catch (error) {
        callback(error);
    }
};