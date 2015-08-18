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
        };
        //Сохранить проект
        this.saveProject = function (obj) {
            return $http({url: '/project/save', method: 'POST', data: obj});
        };
        this.updateProject = function (obj) {
            return $http({url: '/project/update', method: 'POST', data: obj});
        };
        //Получить проекты для пользователя
        this.getProjects = function () {
            return $http({url: '/project/list', method: 'GET'});
        };
        //Загрузит проект
        this.loadProject = function (id) {
            return $http({url: '/project/load/' + id, method: 'GET'});
        };
        this.deleteProject = function(id){
            return $http({url: '/project/delete/' + id, method: 'GET'});
        };
    };
    angular.module('app').service('templateService', ['$http', templateService]);
})();