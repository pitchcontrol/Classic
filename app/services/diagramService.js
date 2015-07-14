(function () {
    "use strict";
    var diagramService = function (integerCounter) {
        var self = this;
        //Колекция сущностей
        this.entities = [];
        this.associations = [];
        //Найти сущность по имени
        this.findEntity = function (name) {
            return _.findWhere(this.entities, {name: name});
        };
        this.addEntity = function (entity) {
            var item = new Entity(this);
            item._integerCounter = integerCounter;
            item.id = integerCounter.getId();
            if (entity == undefined) {
                item.name = 'Entity' + item.id;
            }
            else {
                //Добавляем сущность из шаблона, нужно проверить уникальность
                item.name = _.findWhere(this.entities, {name: entity.name}) != undefined ? entity.name + item.id : entity.name;
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
        //Получает относительные координаты обьекта
        this.geometry.getRelative = function (obj) {
            var x = obj.x - self.geometry.offsetX;
            var y = obj.y - self.geometry.offsetY;
            return {
                x: x,
                y: y
            }
        };
        //Получает упрошенный обьект для сериализации
        //save - означает полную информацию, геометрия и пр
        this.getJSON = function (save) {
            var entities = this.entities.map(function (item) {
                return item.getJSON(save);
            });
            if (save) {
                var obj = {};
                //Сущности
                obj.entities = entities;
                //Состояни счетчика
                //obj.currentCounter = integerCounter.getCurrent();
                //Имя проекта
                obj.projectName = this.projectName;
                return obj;
            }
            return entities;
        };
        this.loadProject = function (obj) {
            this.projectName = obj.name;
            this.projectId = obj.id;
            //Очищаем
            this.entities.forEach(function (item) {
                item.destroy();
            });
            this.entities = [];
            integerCounter.clear();
            //integerCounter.setCurrent(obj.currentCounter);
            //Будем перебирать сущности добавлять стандартными способами
            obj.diagram.entities.forEach(function (obj) {
                self.addEntity(obj);
            });
        };
    };
    angular.module('app').service('diagramService', ['integerCounter', diagramService]);
})
();