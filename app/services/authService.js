(function () {
    "use strict";
    var authService = function ($http, $q, $window) {
        var self = this;
        this.login = function (data) {
            var deferred = $q.defer();
            $http.post('/login', data).success(function (data, status, headers, config) {
                self.user = data;
                $window.sessionStorage.token = data.token;
                deferred.resolve();
            }).error(function (error, status) {
                delete self.user;
                if (status != 200)
                    deferred.reject("Ошибка сервера");
                else
                    deferred.reject(error);
            });
            return deferred.promise;
        };
        this.logoff = function () {
            delete self.user;
            delete $window.sessionStorage.token;
        };
        this.signUp = function (data) {
            var deferred = $q.defer();
            $http.post('/signup', data).success(function (data, status, headers, config) {
                self.user = data;
                $window.sessionStorage.token = data.token;
                deferred.resolve();
            }).error(function (error) {
                delete self.user;
                deferred.reject(error);
            });
            return deferred.promise;
        };
    };
    angular.module('app').service('authService', ['$http', '$q', '$window', authService]);
})();