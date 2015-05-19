(function () {
    "use strict"
    var _count = 0;
    var integerCounter = function () {
        this.getId = function () {
            return _count++;
        };
        this.clear = function () {
            _count = 0;
        };
    };
    angular.module('app').service('integerCounter', [integerCounter]);
})();