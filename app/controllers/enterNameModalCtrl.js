(function () {
    "use strict"
    var enterNameModalCtrl = function ($scope, $modalInstance, diagramService) {
        $scope.model = {name: diagramService.projectName};
        $scope.ok = function () {
            if ($scope.model) {
                diagramService.projectName = $scope.model.name;
                $modalInstance.close();
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('enterNameModalCtrl', ['$scope', '$modalInstance', 'diagramService', enterNameModalCtrl]);
})();