(function () {
    //Универсальный тип для основы содержи
    "use strict";
    var namedItem = function () {
        var funct = function (collection, idService, prefix) {
            this._collection = collection;
            this._idService = idService;
            //Создаем ид
            this.id = idService.getId();
            //Добавляем имя обьекта
            this._name = prefix + this.id;
            var self = this;
            Object.defineProperty(this, 'name', {
                get: function () {
                    return self._name;
                },
                set: function (value) {
                    if (self._collection.findByName(value) == undefined) {
                        self._name = value;
                        self.error = null;
                    } else {
                        self.error = value + ', уже есть';
                    }
                }
            });
        };
        return funct;
    };
    angular.module('app').factory('namedItem', [namedItem]);
})();