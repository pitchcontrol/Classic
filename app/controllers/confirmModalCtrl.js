(function () {
    "use strict"
    var confirmModalCtrl = function ($scope, $uibModalInstance, data) {
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('confirmModalCtrl', ['$scope', '$uibModalInstance', 'data', confirmModalCtrl]);
})();