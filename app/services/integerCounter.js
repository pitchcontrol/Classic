(function () {
    "use strict";
    var _count = 0;
    var integerCounter = function () {
        this.getId = function () {
            return _count++;
        };
        this.clear = function () {
            _count = 0;
        };
        this.getCurrent = function () {
            return _count;
        };
        this.setCurrent = function (id) {
            _count = id;
        };
    };
    angular.module('app').service('integerCounter', [integerCounter]);
})();