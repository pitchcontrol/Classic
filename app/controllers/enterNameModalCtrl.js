(function () {
    "use strict";
    var enterNameModalCtrl = function ($scope, $uibModalInstance, diagramService) {
        $scope.model = {name: diagramService.projectName};
        $scope.ok = function () {
            if ($scope.model) {
                diagramService.projectName = $scope.model.name;
                $uibModalInstance.close();
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('enterNameModalCtrl', ['$scope', '$uibModalInstance', 'diagramService', enterNameModalCtrl]);
})();