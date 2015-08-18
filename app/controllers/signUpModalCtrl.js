(function () {
    "use strict";
    var signUpModalCtrl = function ($scope, $modalInstance, authService) {
        $scope.model = {};
        $scope.ok = function () {
            authService.signUp($scope.model).then(function () {
                $modalInstance.close($scope.model);
            }, function (error) {
                $scope.model.error = error;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('signUpModalCtrl', ['$scope', '$modalInstance', 'authService', signUpModalCtrl]);
})();