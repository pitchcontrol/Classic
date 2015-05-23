(function () {
    "use strict"
    var selectModalCtrl = function ($scope, $modalInstance, templateService, data) {
        templateService.getEntityTemplateList().then(function (responce) {
            $scope.items = responce.data;
        });
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $modalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('selectModalCtrl', ['$scope', '$modalInstance', 'templateService', 'data', selectModalCtrl]);
})();