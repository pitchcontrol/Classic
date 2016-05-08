/**
 * Created by snekrasov on 05.04.2016.
 */
"use strict";
//Генерация Entity Framework контекста
let Builder = require('../../../services/boilerplateBuilder');
let _ = require('lodash-node');
let plur = require('plur');
let enumBuilder = require('../Utils/EnumBuilder');

//Вопросы
module.exports.quetions = [
    {question: "Пространство имен", type: "string"},
    {question: "Название контекста", type: "string"}
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
            var name = field.associationObj.start.name;
            if (field.associationObj.multiplicity) {
                tp = `ICollection<${name}>`;
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
    let context = data.answers[1];
    let renderFiles = [];

    //Проставляем всем сущностям полный тип и пространство имен
    data.entities.forEach((entity)=> {
        entity.namespace = namespace;
        entity.fields.forEach((f)=> {
            f.rawType = getType(f, data.answers);
        });
        //Нужно добавить Ид если нет
        entity.primaryKey = _.find(entity.fields, {'isPrimaryKey': true});
        if (entity.primaryKey === undefined) {
            entity.primaryKey = {name: 'Id', isPrimaryKey: true, type: 'integer', rawType: 'int'};
            entity.fields.unshift(entity.primaryKey);
        }
    });
    //Ид должны быть уже проставленны
    data.entities.forEach((entity)=> {
        //Для ассоциаций нужно добавлять внешний ид
        let index = _.findIndex(entity.fields, {type: 'Association'});
        if (index != -1) {
            let startEntity = _.find(data.entities, {name: entity.fields[index].associationObj.start.name});
            entity.fields.splice(index, 0, {
                name: entity.fields[index].associationObj.start.name + 'Id',
                type: entity.primaryKey.type,
                rawType: entity.primaryKey.rawType
            });
        }
    });
    let csharpBuilder = Builder.getChsarpBuilder();

    //Строим базовый класс
    csharpBuilder.writeLineOpenBrace('namespace {namespace}');
    csharpBuilder.commentLine("/// <summary>");
    csharpBuilder.commentLine("/// {description}");
    csharpBuilder.commentLine("/// </summary>");
    csharpBuilder.writeLineOpenBrace('public class {name}');
    //Нужно проверить отношения один ко многим. Если есть тогда нужно
    //Создать в конструкторе инстансы колекций и сам конструктор

    csharpBuilder.getBuilder()
        .ifLine('isPrimaryKey', true, '[Key]')
        .ifLine('isRequired', true, '[Required]')
        .commentLine("/// <summary>")
        .commentLine("/// {description}")
        .commentLine("/// </summary>")
        .writeLine("public {rawType} {name} {{ get; set; }}")
        .sheduleBuild("fields");
    csharpBuilder.closeAllBraces();
    renderFiles = csharpBuilder.build(data.entities, true);


    //Если есть enum надо создать файлы
    enumBuilder.render(data, namespace, renderFiles);

    //Формируем клас контекста
    //Для сущностей нужно задать множественное число
    data.entities.map((item)=>{
       item.pluralName = plur(item.name);
    });

    csharpBuilder = Builder.getChsarpBuilder();
    csharpBuilder.writeLineOpenBrace('namespace {namespace}');

    csharpBuilder.writeLineOpenBrace('public class {name}: DbContext');
    csharpBuilder.getBuilder()
        .writeLine("public DbSet<{name}> {pluralName} {{ get; set; }}")
        .sheduleBuild("entities");
    csharpBuilder.closeAllBraces();
    csharpBuilder.build([{name: context, entities: data.entities, namespace: namespace}], renderFiles);
    callback(null, renderFiles);
};