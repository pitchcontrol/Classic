/**
 * Created by snekrasov on 24.04.2015.
 */
(function () {
    "use strict";
    angular.module('app', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.contextMenu'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl',
                title: 'Главная'
            }).otherwise({
                redirectTo: '/'
            });
        }]);
        //Пока руками укажу
        //.run(['$location', '$rootScope', function ($location, $rootScope) {
        //    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        //        $rootScope.title = current.$$route.title;
        //    });
        //}]);
})();