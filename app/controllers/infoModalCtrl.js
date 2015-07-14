//Выводит информационное сообщение
(function () {
    "use strict"
    var infoModalCtrl = function ($scope, $modalInstance, data) {
        $scope.message = data.message;
        $scope.title = data.title;
        $scope.ok = function () {
            $modalInstance.close();
        };
    };
    angular.module('app').controller('infoModalCtrl', ['$scope', '$modalInstance', 'data', infoModalCtrl]);
})();