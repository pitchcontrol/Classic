(function () {
    "use strict"
    var templateService = function ($http) {
        var host = '';
        //Получить список шаблонов сущностей
        this.getEntityTemplateList = function () {
            return $http.get('/entities/list');
        };
        //Получить список генерторов
        this.getGenerateTemplateList = function () {
            return $http.get('/template/list', {cache: true});
        };
        //Получить вопросы для шаблона
        this.getQuestionList = function (id) {
            return $http.get('/template/questions/' + id, {cache: true});
        };
        //Получить код
        this.generate = function (obj) {
            return $http({url: '/template/execute', method: 'POST', data: obj, responseType: 'arraybuffer'});
        }
    };
    angular.module('app').service('templateService', ['$http', templateService]);
})();