/**
 * Created by snekrasov on 26.08.2015.
 */
"use strict";
let Builder = require('../../../services/boilerplateBuilder');
let format = require('string-format');
let lodash = require('lodash-node');
let tools = require('../../../services/tools');

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
    }

    field.rawType = tp;
    field.label = field.description || field.name;
    field.isRequired = field.isRequired ? ' required ' : '';
}
module.exports.render = function (data, callback) {
    try {
        let builder = Builder.getHtmlBuilder();
        //let renderFiles = [];
        let fullPage = data.answers[0];

        tools.forEachMany(data.entities, "fields", (f)=> {
            getRaw(f, data);
        });

        if (fullPage) {
            builder.writeLine("<!DOCTYPE html>");
            builder.writeTagLine("html");
            builder.writeTagLine('head', 'lang="en"');
            builder.writeLine('<meta charset="UTF-8">');
            builder.writeLine('<title></title>');
            builder.closeLastTagLine();
            builder.writeTagLine("body");
        }
        builder.writeTagLine('form', 'role="form" action="#"');
        let flBl = builder.getBuilder();
        flBl.setFilter((fl)=> fl.type != 'Association')
            //default
            .writeTagLine("div", 'class="form-group"')
            .writeTagWithBodyLine("label", 'for="{name}_"', '{label}')
            .writeTagSelfCloseLine("input", 'type="{rawType}" class="form-control" id="{name}_" placeholder="{name}_"')
            .closeAllTagsLine()
            //checkbox
            .setCase("type", "bool")
            .writeTagLine("div", 'class="checkbox"')
            .writeTagLine("label")
            .writeTagSelfClose("input", 'type="checkbox"')
            .writeWithoutIndentLine("Администратор")
            .closeAllTagsLine()
            //select
            .setCase("type", "enum")
            .writeTagLine("div", 'class="form-group"')
            .writeTagWithBodyLine("label", 'for="{name}_"', '{label}')
            .writeTagLine("select", "class='form-control' id='{name}_'")
            .getBuilder()
            .writeTagWithBodyLine("option", "value='{0}'", "{0}")
            .sheduleBuild("enumValues");
        flBl.closeAllTagsLine();
        //build
        flBl.sheduleBuild("fields");
        builder.writeTagWithBodyLine("button", 'type="submit" class="btn btn-default"', "submit");
        builder.closeAllTagsLine();
        //renderFiles.push({name: entity.name + ".html", text: builder.trimEnd()});
        callback(null, builder.build(data.entities, true));
    }
    catch
        (error) {
        callback(error);
    }
};