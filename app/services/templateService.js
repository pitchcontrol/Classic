(function () {
    "use strict"
    var templateService = function ($http) {
        var host = '';
        //Получить список шаблонов сущностей
        this.getEntityTemplateList = function () {
            return $http.get('../test/entityTemplates.json');
        };
    };
    angular.module('app').service('templateService', ['$http', templateService]);
})();