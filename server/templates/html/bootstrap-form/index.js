/**
 * Created by snekrasov on 26.08.2015.
 */
"use strict";
let Builder = require('../../../services/boilerplateBuilder');
let format = require('string-format');
let lodash = require('lodash-node');

module.exports.quetions = [
    {question: "Сформировать полную HTML страницу", type: "bool", default: false}
];

function getRaw(field, data) {
    let builder = Builder.getHtmlBuilder();
    var tp = 'text';
    var isRequired = field.isRequired ? ' required ' : '';
    let description = field.description || field.name;
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
            builder.writeTagLine("div", 'class="checkbox"');
            builder.writeLine('<label>\r\n<input type="{0}" class="form-control" id="{1}_"></label>', tp, field.name);
            builder.closeAllTagsLine();
            return builder.result;
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
    }
    //return format("<input id='{0}_' type='{1}'{2}>", field.name, tp, isRequired);
    //_builder.numberIndents = 1;
    //_builder.writeTagLine("div", 'class="form-group"');
    //_builder.writeLine('<label for="{name}_">{description}</label>', field);
    //_builder.writeLine('<input type="{0}" class="form-control" id="{1}_" placeholder="{2}">', tp, field.name, field.name);
    //_builder.closeAllTagsLine();
    // return _builder.trimEnd();
    field.rawType = tp;
    field.rawDescription = description;
}
module.exports.render = function (data, callback) {
    try {
        let builder = Builder.getHtmlBuilder();
        //let renderFiles = [];
        let fullPage = data.answers[0];

        data.entities.forEach((entity)=> {
            entity.fields.forEach((f)=> {
                getRaw(f, data);
            });
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
        builder.getBuilder().setFilter((fl)=> fl.type != 'Association')
            //default
            .writeTagLine("div", 'class="form-group"')
            .writeTagWithBodyLine("label", 'for="{name}_"', '{rawDescription}')
            .writeTagSelfCloseLine("input", 'type="{rawType}" class="form-control" id="{name}_" placeholder="{name}_"')
            .closeAllTagsLine()
            //checkbox
            .setCase("type", "bool")
            .writeTagLine("div", 'class="checkbox"')
            .writeTagLine("label")
            .writeTagSelfClose("input", 'type="checkbox"')
            .writeWithoutIndentLine("Администратор")
            .closeAllTagsLine()
            //build
            .sheduleBuild("fields");
        builder.writeTagWithBodyLine("button", 'type="submit" class="btn btn-default"', "submit");
        builder.closeAllTagsLine();
        //renderFiles.push({name: entity.name + ".html", text: builder.trimEnd()});

        callback(null, builder.build(data.entities, true));
    }
    catch (error) {
        callback(error);
    }
};