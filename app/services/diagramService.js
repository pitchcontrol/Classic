(function () {
    "use strict";
    var diagramService = function () {
        //Колекция сущностей
        this.entities = [];
        this.associations = [];
        var _count = 0;
        this.addEntity = function () {
            var item = new Entity(this);
            item.name = 'Entity' + _count;
            this.entities.push(item);
            _count++;
            return item;
        };

        //this.addEntity = function (entity) {
        //    if (_.findWhere(_entities, {name: entity.name}) == undefined) {
        //        _entities.push(entity);
        //    } else {
        //        entity.error = entity.name + ', уже есть в колекции.';
        //    }
        //};
        //
        ////Колекция ассоциаций
        //this.entities.associations = [];
        //this.addAssociation = function (field) {
        //
        //    if (this.associations.some(function (i) {
        //            return i.field == field && i.end == field.entity && i.start == field.association;
        //        }))
        //        return;
        //    var obj = {
        //        start: field.association,
        //        end: field.entity,
        //        field: field,
        //        toString: function () {
        //            return field.entity.name + '_' + field.name + '_' + field.association.name;
        //        }
        //    };
        //    //Добавляем в модель ссылку на объкт
        //    field.associationObj = obj;
        //    this.associations.push(obj);
        //    return obj;
        //};
        //this.removeAssociation = function (field) {
        //    if (!field.associationObj)
        //        return;
        //    var index = this.associations.indexOf(field.associationObj);
        //    if (index !== undefined)
        //        this.associations.splice(index, 1);
        //};
    };
    angular.module('app').service('diagramService', [diagramService]);
})
();