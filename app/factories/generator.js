(function () {
    "use strict";
    var Generator = function (http) {
        this._http = http;
        this.meta = {};
        this.model = {};
        this.meta.title = 'Добавить генератор';
        this.meta.icon = './image/hand48.svg';
        this.meta.fields = [
            {
                name: "name",
                label: "Название генератора",
                placeholder: "Название",
                type: "string",
                required: true
            },
            {
                name: "language",
                label: "Язык",
                placeholder: "Язык",
                type: "enum",
                required: true,
                choices: [{name: "html"}, {name: "javascript"}]
            },
            {name: "module", label: "Модуль", placeholder: "Модуль", type: "string", required: true},
            {
                name: "description",
                label: "Описание генератора",
                placeholder: "Описание генератора",
                type: "string",
                required: true
            }];
    };
    Generator.prototype.save = function () {
        this.model.language = this.model.language.name;
        return this._http({url: '/template/add', method: 'POST', data: this.model});
    };
    var generator = function ($http, $q) {
        var generator = {
            create: function () {
                return new Generator($http);
            },
            findAll: function () {
                var deferred = $q.defer();
                var list = [];
                $http.get('/template/list', {cache: true}).then(function (respose) {
                    respose.data.forEach(function (data) {
                        var obj = new Generator($http);
                        obj.model = data;
                        list.push(obj);
                    });
                    deferred.resolve(list);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
        return generator;
    };
    angular.module('app').factory('generator', ['$http', '$q', generator]);
})();