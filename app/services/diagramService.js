(function () {
    "use strict";
    var diagramService = function (integerCounter, $timeout, namedCollection, namedItem) {
        var self = this;
        //Колекция сущностей
        this.entities = [];
        this.associations = [];
        this.shedule = [];
        //Колеуция представлений
        this.views = new namedCollection(null, integerCounter);
        this.views.collection.push({
            id: -1,
            name: "Главная"
        });
        this.views.onRemove = function (collection, item) {
            return item.id !== -1;
        };
        //Колекция перечислений
        this.enums = new namedCollection(null, integerCounter);
        //Найти сущность по имени
        this.findEntity = function (name) {
            return _.findWhere(this.entities, {
                name: name
            });
        };
        //Найти представление
        this.findView = function (name) {
            return _.findWhere(this.views, {
                name: name
            });
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
                item.name = _.findWhere(this.entities, {
                    name: entity.name
                }) != undefined ? entity.name + item.id : entity.name;
                item.geometry = entity.geometry;
                entity.fields.forEach(function (i) {
                        var f = item.addField(i);
                    }
                );
            }
            this.entities.push(item);
            return item;
        };
        this.removeEntity = function (entity) {
            entity.destroy();
            //Удаляем из вьющек
            this.views.collection.forEach(function (item) {
                    if (item.entities)
                        item.entities.remove(entity);
                }
            );
            this.entities.remove(entity);
        };
        this.geometry = {
            offsetX: 0,
            offsetY: 0
        };
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
            var obj = {};
            obj.enums = this.enums.collection.map(function (item) {
                    return {
                        name: item.name,
                        values: item.values
                    };
                }
            );
            var entities = this.entities.map(function (item) {
                    return item.getJSON(save);
                }
            );
            obj.entities = entities;
            if (save) {
                var obj = {};
                //Сущности
                obj.entities = entities;
                //Имя проекта
                obj.id = this.projectId;
                obj.projectName = this.projectName;
                obj.views = this.views.collection.map(function (item) {
                        var obj = {
                            name: item.name
                        };
                        obj.entities = _.pluck(item.entities, 'name');
                        return obj;
                    }
                );
                obj.enums = this.enums.collection.map(function (item) {
                        return {
                            name: item.name,
                            values: item.values
                        };
                    }
                );
                return obj;
            }
            return obj;
        };
        //Очистить проект
        this.clear = function () {
            //Очищаем
            this.entities.forEach(function (item) {
                    item.destroy();
                }
            );
            this.entities = [];
            this.views.clear();
            this.views.collection.push({
                id: -1,
                name: "Главная"
            });
            this.projectName = undefined;
            this.projectId = undefined;
            this.enums.clear();
            //this.views.collection.push({id: -1, name: "Главная"});
            integerCounter.clear();
        };
        this.loadProject = function (obj) {
            this.clear();
            this.projectName = obj.name;
            this.projectId = obj.id;
            //Добавляем енумы, enum должны быть раньше всех на них будет ссылка
            if (obj.diagram.enums)
                obj.diagram.enums.forEach(function (item) {
                    self.enums.addItem(item);
                });
            //Будем перебирать сущности добавлять стандартными способами
            obj.diagram.entities.forEach(function (obj) {
                    self.addEntity(obj);
                }
            );
            //Добавляем представления
            if (obj.diagram.views)
                obj.diagram.views.forEach(function (item) {
                        var view = self.views.addItem();
                        view.name = item.name;
                        view.entities = [];
                        item.entities.forEach(function (v) {
                                view.entities.push(self.findEntity(v));
                            }
                        );
                    }
                );
            var main = self.views.findByName("Главная");
            if (main)
                main.id = -1;
            else {
                self.views.collection.push({
                    id: -1,
                    name: "Главная"
                });
            }

            //Важный момент нельзя сразу проставлять ассоциации, потому что геометрия еше не вычесленна
            //будем строить в два этапа
            //Таймаут нужен что-бы построились блоки
            $timeout(function () {
                    for (var i = 0; i < self.shedule.length; i++) {
                        var item = self.shedule.shift();
                        item.field.association = item.entity;
                    }
                }
                , 100);
        };
    };
    angular.module('app').service('diagramService', ['integerCounter', '$timeout', 'namedCollection', 'namedItem', diagramService]);
})();
