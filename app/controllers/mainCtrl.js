(function () {
    "use strict";
    var mainCtrl = function ($scope, $modal, diagramService) {
        //Сущности
        $scope.diagram = diagramService;
        $scope.addEntity = function () {
            $modal.open({
                templateUrl: '../app/views/entityModal.html',
                controller: 'entityModalCtrl',
                resolve: {
                    item: function () {
                        return null;
                    }
                }
            });
        };
        $scope.editEntity = function (entity) {
            $modal.open({
                templateUrl: '../app/views/entityModal.html',
                controller: 'entityModalCtrl',
                resolve: {
                    item: function () {
                        return entity;
                    }
                }
            });
        };
    };
    angular.module('app').controller('mainCtrl', ['$scope', '$modal', 'diagramService', mainCtrl]);
})();