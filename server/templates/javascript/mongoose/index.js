"use strict";
var ejs = require('ejs'),
    fs = require('fs'),
    util = require('util'),
    format = require('string-format'),
    tools = require('../../../services/tools'),
    Builder = require('../../../services/boilerplateBuilder'),
    lodash = require('lodash-node');

//Получит тип Sequelize
function getType(field, data) {
    var tp = 'String';
    switch (field.type) {
        case 'integer':
        case 'long':
            field.rawType = 'Number';
            break;
        case 'datetime':
            field.rawType = 'Date';
            break;
        case 'bool':
            field.rawType = 'Boolean';
            break;
        case 'Association':
            field.rawType = field.associationObj.multiplicity ? ("[" + field.associationObj.start.name + "]") : (field.associationObj.start.name);
            break;
        case 'enum':
            field.rawType = 'String';
            field.enumValues = JSON.stringify(lodash.findWhere(data.enums, {name: field.enum}).values);
            break;
        default :
            field.rawType = 'String';
    }
    field.isRequired = field.isRequired || field.isPrimaryKey ? ', required: true' : '';
}

module.exports.quetions = [];

module.exports.render = function (data, callback) {
    try {
        tools.forEachMany(data.entities, "fields", (f)=> getType(f, data));
        let builder = Builder.getJavaScriptBuilder();
        builder.setBraces("({", "});");
        builder.writeLine("var mongoose = require('mongoose');")
            .writeLine("var Schema = mongoose.Schema;")
            .writeLineOpenBrace("var {name} = new Schema")
            .getBuilder({markEnd: ","})
            .writeLine("{name}: {{ type: {rawType}{isRequired} }}")
            .setCase("type", "enum")
            .writeLine("{name}: {{ type: {rawType}{isRequired}, enum: {enumValues} }}")
            .sheduleBuild("fields");
        builder.closeAllBraces();
        callback(null, builder.build(data.entities, true));
    }
    catch (error) {
        callback(error);
    }
};
