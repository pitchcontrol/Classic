(function () {
    "use strict";
    var loginModalCtrl = function ($scope, authService, $uibModalInstance) {
        $scope.model = {};
        $scope.ok = function () {
            authService.login({login: $scope.model.login, password: $scope.model.password}).then(function (data) {
                $scope.model.error = null;
                $uibModalInstance.close();
            }, function (error) {
                $scope.model.error = error;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('loginModalCtrl', ['$scope', 'authService', '$uibModalInstance', loginModalCtrl]);
})();