(function () {
    "use strict";
    //Работает с перечислениями
    var enumModalCtrl = function ($scope, data, $modalInstance, diagramService) {
        $scope.model = data || {values: []};
        $scope.$modalInstance = $modalInstance;
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
            $modalInstance.close();
        };
    };
    angular.module('app').controller('enumModalCtrl', ['$scope', 'data', '$modalInstance', 'diagramService', enumModalCtrl]);
})();