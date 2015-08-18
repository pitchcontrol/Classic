(function () {
    //Стоит колекцию которая состоит из элементов с name, id
    "use strict";
    var namedCollection = function (namedItem) {

        var funct = function (funcConst, idService) {
            this.collection = [];
            this._funcConst = funcConst;
            this._idService = idService;
        };
        funct.prototype.addItem = function (item) {
            //Проверим возможность создания по имени
            if (item && item.name) {
                if (this.findByName(item.name))
                    return null;
            }
            var obj;
            if (this._funcConst)
                obj = new this._funcConst(this, this._idService);
            else {
                obj = new namedItem(this, this._idService);
            }
            //Если обькт задан то копируем свойства
            if (item) {
                for (var key in item) {
                    obj[key] = item[key];
                }
            }
            this.collection.push(obj);
            return obj;
        };
        //Поиск по ид
        funct.prototype.findById = function (id) {
            var f = this.collection.filter(function (item) {
                return item.id === id;
            });
            if (f != undefined && f.length > 0)
                return f[0];
        };
        //Поиск по имени
        funct.prototype.findByName = function (name) {
            var f = this.collection.filter(function (item) {
                return item.name === name;
            });
            if (f != undefined && f.length > 0)
                return f[0];
        };
        //Удалить, причем перед удалением вызвать destroy()
        funct.prototype.remove = function (item) {
            //Перед удаление вызовем событие
            if (this.onRemove != undefined) {
                if (!this.onRemove(this.collection, item))
                    return;
            }
            var index = this.collection.indexOf(item);
            while (index != -1) {
                var obj = this.collection[index];
                if (obj.destroy != undefined) {
                    obj.destroy();
                }
                this.collection.splice(index, 1);
                index = this.collection.indexOf(item);
            }
        };
        funct.prototype.first = function () {
            return this.collection[0];
        };
        funct.prototype.last = function () {
            return this.collection[this.collection.length - 1];
        };
        //Очистить колекцию причем для каждого элемента вызвать destroy()
        funct.prototype.clear = function () {
            while (this.collection.length) {
                var obj = this.collection.pop();
                if (obj.destroy != undefined) {
                    obj.destroy();
                }
            }
        };
        return funct;
    };
    angular.module('app').factory('namedCollection', ['namedItem', namedCollection]);
})();