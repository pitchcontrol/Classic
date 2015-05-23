(function () {
    "use strict"
    var confirmModalCtrl = function ($scope, $modalInstance, data) {
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('confirmModalCtrl', ['$scope', '$modalInstance', 'data', confirmModalCtrl]);
})();