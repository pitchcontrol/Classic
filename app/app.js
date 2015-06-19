/**
 * Created by snekrasov on 24.04.2015.
 */
(function () {
    "use strict";
    angular.module('app', ['ngRoute', 'ui.bootstrap'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl',
                title: 'Главная'
            }).otherwise({
                redirectTo: '/'
            });
        }]);
})();