/**
 * Created by snekrasov on 24.04.2015.
 */
(function () {
    "use strict";
    angular.module('app', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.contextMenu'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/generators', {
                templateUrl: 'views/generators.html',
                controller: 'generatorCtrl',
                title: 'Генераторы',
                isAdmin: true
            });
            $routeProvider.when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl',
                title: 'Главная'
            }).otherwise({
                redirectTo: '/'
            });
        }]);
})();