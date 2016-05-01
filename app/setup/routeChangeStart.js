/**
 * Created by Станислав on 01.05.2016.
 */
(function () {
    //Перехватываем смену маршрута если юзер не админ
    var routeChangeStart = function ($location, $rootScope, authService) {
        $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
            if (next.$$route) {
                var userAdmin = false;
                if (authService.user)
                    userAdmin = authService.user.isAdmin;
                var routeAdmin = next.$$route.isAdmin;
                if (routeAdmin && !userAdmin) {
                    $location.path('/')
                }
            }
        });
    };
    angular.module('app').run(['$location', '$rootScope', 'authService', routeChangeStart]);
})();