//Выводит информационное сообщение
(function () {
    "use strict"
    var infoModalCtrl = function ($scope, $uibModalInstance, data) {
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    };
    angular.module('app').controller('infoModalCtrl', ['$scope', '$uibModalInstance', 'data', infoModalCtrl]);
})();