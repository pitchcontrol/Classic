(function () {
    "use strict";
    var selectModalCtrl = function ($scope, $uibModalInstance, data, promise) {
        promise().then(function (responce) {
            $scope.items = responce.data;
        });
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('selectModalCtrl', ['$scope', '$uibModalInstance', 'data', 'promise', selectModalCtrl]);
})();