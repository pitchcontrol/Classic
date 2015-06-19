(function () {
    "use strict"
    var loginModalCtrl = function ($scope, authService, $modalInstance) {
        $scope.ok = function () {
            authService.login({login: $scope.model.login, password: $scope.model.password}).then(function (data) {
                $modalInstance.close();
            }, function (error) {
                $scope.model.error = error;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('loginModalCtrl', ['$scope', 'authService', '$modalInstance', loginModalCtrl]);
})();