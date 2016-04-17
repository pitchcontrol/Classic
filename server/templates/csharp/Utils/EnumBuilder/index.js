/**
 * Created by Станислав on 17.04.2016.
 */
"use strict";
let Builder = require('../../../../services/boilerplateBuilder');


module.exports.render = function (data, namespace, renderFiles) {
    let csharpBuilder = Builder.getChsarpBuilder();

    if (data.enums && data.enums.length > 0) {
        data.enums.forEach((enu)=> {
            enu.namespace = namespace;
        });
        csharpBuilder = Builder.getChsarpBuilder();
        csharpBuilder.writeLineOpenBrace('namespace {namespace}');
        csharpBuilder.writeLineOpenBrace('public enum {name}');
        let builder = csharpBuilder.getBuilder();
        builder._builder.markEnd = ',';
        builder.writeLine("{0}");
        builder.sheduleBuild("values");
        csharpBuilder.closeAllBraces();
        csharpBuilder.build(data.enums, renderFiles);
    }
};