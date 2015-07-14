(function () {
    "use strict";
    //Добавляет в заголовки токен аунтификации
    var authInterceptor = function ($q, $window) {

        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        }
    };
    var app = angular.module('app');
    app.factory('authInterceptor', ['$q', '$window', authInterceptor]).config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
})();