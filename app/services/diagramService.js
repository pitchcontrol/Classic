(function () {
    "use strict";
    var diagramService = function (integerCounter) {
        //Колекция сущностей
        this.entities = [];
        this.associations = [];
        this.addEntity = function () {
            var item = new Entity(this);
            item._integerCounter = integerCounter;
            item.id = integerCounter.getId();
            item.name = 'Entity' + item.id;
            this.entities.push(item);
            return item;
        };
        this.removeEntity = function (entity) {
            entity.destroy();
            this.entities.remove(entity);
        };
        this.geometry = {offsetX: 0, offsetY: 0};
    };
    angular.module('app').service('diagramService', ['integerCounter', diagramService]);
})
();