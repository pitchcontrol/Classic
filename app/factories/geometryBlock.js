(function () {
    "use strict";
    var funct = function (x, y, width, height) {
        var _x, _y, _width, _height, self, _int = 20;
        _x = x;
        _y = y;
        _width = width;
        _height = height;
        self = this;
        self.bottom = {};
        self.right = {};
        self.bottomLeft = {};
        self.bottomRight = {};
        self.topRight = {};
        function resize(obj) {
            obj.bottom.x = obj.x + (obj.width / 2);
            obj.bottom.y = obj.y + obj.height;
            obj.right.y = obj.y + (obj.height / 2);
            obj.right.x = obj.x + obj.width;
            //Правый верхний угол
            obj.topRight.x = obj.x + obj.width;
            obj.topRight.y = obj.y;
            //Нижний левый угол
            obj.bottomLeft.x = obj.x;
            obj.bottomLeft.y = obj.y + obj.height;
            //Нижний правый угол
            obj.bottomRight.x = obj.x + obj.width;
            obj.bottomRight.y = obj.y + obj.height;
        }

        //Выясняет пересечиние двух блоков
        this.intersection = function (geometry) {
            //Нижний левый угол заходит в верхний правый сектор
            if (self.x < geometry.bottomLeft.x && geometry.bottomLeft.x < self.topRight.x &&
                self.topRight.y < geometry.bottomLeft.y && geometry.bottomLeft.y < self.bottomRight.y) {
                var x = self.topRight.x - geometry.bottomLeft.x + _int;
                var y = geometry.bottomLeft.y - self.topRight.y + _int;
                return {x: x, y: y};
            }
            //Левый верхний угол в нижний правый сектор
            if (self.bottomLeft.x < geometry.x && geometry.x < self.bottomRight.x &&
                self.topRight.y < geometry.y && geometry.y < self.bottomRight.y) {
                var x = self.topRight.x - geometry.x + _int;
                var y = self.bottomRight.y - geometry.y + _int;
                return {x: x, y: y};
            }
            //Правый верхний угол в левый нижний сектор
            if (self.bottomLeft.x < geometry.topRight.x && geometry.topRight.x < self.bottomRight.x &&
                self.bottomLeft.y > geometry.topRight.y && geometry.topRight.y > self.y) {
                var x = self.bottomLeft.x - geometry.topRight.x - _int;
                var y = self.bottomLeft.y - geometry.topRight.y + _int;
                return {x: x, y: y};
            }
            //Правый нижний угол в верхний левый сектрор
            if (self.x < geometry.bottomRight.x && geometry.bottomRight.x < self.topRight.x &&
                self.y < geometry.bottomRight.y && geometry.bottomRight.y < self.bottomLeft.y) {
                var x = self.x - geometry.bottomRight.x - _int;
                var y = self.y - geometry.bottomRight.y - _int;
                return {x: x, y: y};
            }
            return null;
        };
        Object.defineProperty(self, 'x', {
            get: function () {
                return _x;
            },
            set: function (value) {
                _x = value;
                resize(self);
            }
        });
        Object.defineProperty(self, 'y', {
            get: function () {
                return _y;
            },
            set: function (value) {
                _y = value;
                resize(self);
            }
        });
        Object.defineProperty(self, 'width', {
            get: function () {
                return _width;
            },
            set: function (value) {
                _width = value;
                resize(self);
            }
        });
        Object.defineProperty(self, 'height', {
            get: function () {
                return _height;
            },
            set: function (value) {
                _height = value;
                resize(self);
            }
        });
        resize(self);
    };
    var geometryBlock = function () {
        return funct;
    };
    angular.module('app').factory('geometryBlock', [geometryBlock]);
})
();