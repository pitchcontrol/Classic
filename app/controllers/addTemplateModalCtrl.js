(function () {
    "use strict";
    var addTemplateModalCtrl = function ($scope, templateService, $modalInstance) {
        $scope.model = {};
        $scope.ok = function () {
            templateService.addGenerator($scope.model).then(function () {
                delete $scope.model.error;
                $modalInstance.close();
            }, function (error) {
                $scope.model.error = error.data;
            });
        };
        $scope.cancel = function () {
            $scope.model.error = null;
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('addTemplateModalCtrl', ['$scope', 'templateService', '$modalInstance', addTemplateModalCtrl]);
})();