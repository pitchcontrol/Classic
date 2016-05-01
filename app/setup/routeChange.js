/**
 * Created by Станислав on 01.05.2016.
 */
(function () {
    var routeChange = function ($location, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    };
    angular.module('app').run(['$location', '$rootScope', routeChange]);
})();