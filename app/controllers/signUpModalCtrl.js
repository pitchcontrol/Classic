(function () {
    "use strict";
    var signUpModalCtrl = function ($scope, $uibModalInstance, authService) {
        $scope.model = {};
        $scope.ok = function () {
            authService.signUp($scope.model).then(function () {
                $uibModalInstance.close($scope.model);
            }, function (error) {
                $scope.model.error = error;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('signUpModalCtrl', ['$scope', '$uibModalInstance', 'authService', signUpModalCtrl]);
})();