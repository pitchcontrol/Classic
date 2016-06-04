(function () {
    "use strict";
    //Работает с перечислениями
    var enumModalCtrl = function ($scope, data, $uibModalInstance, diagramService) {
        $scope.model = data || {values: []};
        $scope.$uibModalInstance = $uibModalInstance;
        $scope.ok = function () {
            if (!data) {
                if (!diagramService.enums.addItem($scope.model)) {
                    $scope.model.error = "Уже есть такое перечисление";
                    return;
                }
            } else {
                if (data.error) {
                    $scope.model.error = data.error;
                    return;
                }
            }
            $uibModalInstance.close();
        };
    };
    angular.module('app').controller('enumModalCtrl', ['$scope', 'data', '$uibModalInstance', 'diagramService', enumModalCtrl]);
})();