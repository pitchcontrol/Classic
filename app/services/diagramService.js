(function () {
    "use strict";
    var diagramService = function (integerCounter) {
        //Колекция сущностей
        this.entities = [];
        this.associations = [];
        this.addEntity = function (entity) {
            var item = new Entity(this);
            item._integerCounter = integerCounter;
            item.id = integerCounter.getId();
            if (entity == undefined) {
                item.name = 'Entity' + item.id;
            }
            else {
                //Добавляем сущность из шаблона, нужно проверить уникальность
                if (_.findWhere(this.entities, {name: entity.name}) != undefined) {
                    item.name = entity.name + item.id;
                } else {
                    item.name = entity.name;
                }
                entity.fields.forEach(function (i) {
                    var f = item.addField(i);

                });
            }
            this.entities.push(item);
            return item;
        };
        this.removeEntity = function (entity) {
            entity.destroy();
            this.entities.remove(entity);
        };
        this.geometry = {offsetX: 0, offsetY: 0};
        //Получает упрошенный обьект для сериализации
        this.getJSON = function () {
            return this.entities.map(function (item) {
                return item.getJSON();
            });
        };
    };
    angular.module('app').service('diagramService', ['integerCounter', diagramService]);
})
();