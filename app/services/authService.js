(function () {
    "use strict"
    var authService = function ($http, $q, $window) {
        var deferred = $q.defer();
        var self = this;
        self.login = function (data) {
            $http.post('/login', data).success(function (data, status, headers, config) {
                self.user = data;
                $window.sessionStorage.token = data.token;
                deferred.resolve();
            }).error(function (error) {
                delete self.user;
                deferred.reject(error);
            });
            return deferred.promise;
        };
        self.logoff = function () {
            delete self.user;
            delete $window.sessionStorage.token;
        };
    };
    angular.module('app').service('authService', ['$http', '$q', '$window', authService]);
})();