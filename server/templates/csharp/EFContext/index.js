/**
 * Created by snekrasov on 05.04.2016.
 */
"use strict";
//Генерация Entity Framework контекста
let Builder = require('../../../services/boilerplateBuilder');

//Вопросы
module.exports.quetions = [
    {question: "Пространство имен", type: "string"}
];
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
                tp = util.format('ICollection<%s>', name);
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

module.exports.render = function (data, callback) {
    let namespace = data.answers[0];
    let renderFiles = [];

    //Проставляем всем сущностям полный тип и пространство имен
    data.entities.forEach((entity)=> {
        entity.namespace = namespace;
        entity.fields.forEach((f)=> {
            f.rawType = getType(f, data.answers);
        });
    });
    let csharpBuilder = Builder.getChsarpBuilder();

    //Строим базовый класс
    csharpBuilder.writeLineOpenBrace('namespace {namespace}');

    csharpBuilder.writeLineOpenBrace('public class {name}');
    //Нужно проверить отношения один ко многим. Если есть тогда нужно
    //Создать в конструкторе инстансы колекций и сам конструктор

    csharpBuilder.getBuilder()
        .commentLine("/// <summary>")
        .commentLine("/// {description}")
        .commentLine("/// </summary>")
        .writeLine("public {rawType} {name} {{ get; set; }}")
        .sheduleBuild("fields");
    csharpBuilder.closeAllBraces();
    renderFiles = csharpBuilder.build(data.entities, true);


    //Если есть enum надо создать файлы
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
        //renderFiles.push({name: e.name + ".cs", text: builder.result});
    }
    callback(null, renderFiles);
};