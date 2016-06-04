(function () {
    "use strict";
    var addTemplateModalCtrl = function ($scope, templateService, $uibModalInstance) {
        $scope.model = {};
        $scope.ok = function () {
            templateService.addGenerator($scope.model).then(function () {
                delete $scope.model.error;
                $uibModalInstance.close();
            }, function (error) {
                $scope.model.error = error.data;
            });
        };
        $scope.cancel = function () {
            $scope.model.error = null;
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('addTemplateModalCtrl', ['$scope', 'templateService', '$uibModalInstance', addTemplateModalCtrl]);
})();