(function () {
    "use strict"
    var authService = function ($http, $q) {
        var deferred = $q.defer();
        var self = this;
        self.login = function (data) {
            $http.post('/login', data).success(function (data, status, headers, config) {
                self.user = data;
                deferred.resolve();
            }).error(function (data, status, headers, config) {
                delete self.user;
                deferred.reject();
            });
            return deferred.promise;
        };
    };
    angular.module('app').service('authService', ['$http', '$q', authService]);
})();