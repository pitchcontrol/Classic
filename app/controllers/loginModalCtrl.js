(function () { "use strict"
    var loginModalCtrl = function ($scope, authService, $modalInstance) {
        $scope.model = {};
        $scope.ok = function () {
            authService.login({login: $scope.model.login, password: $scope.model.password}).then(function (data) {
                $scope.model.error = null;
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