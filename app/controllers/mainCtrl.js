(function () {
    "use strict";
    var mainCtrl = function ($scope, $modal, diagramService, templateService) {
        //Сущности
        $scope.diagram = diagramService;
        $scope.addEntity = function () {
            var entity = diagramService.addEntity();
            var modalInstance = $modal.open({
                templateUrl: '../app/views/entityModal.html',
                controller: 'entityModalCtrl',
                resolve: {
                    item: function () {
                        return entity;
                    }
                }
            });
            modalInstance.result.then(null, function () {
                diagramService.removeEntity(entity);
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
        $scope.removeEntity = function (entity) {
            var modalInstance = $modal.open({
                templateUrl: '../app/views/confirmModal.html',
                controller: 'confirmModalCtrl',
                resolve: {
                    data: function () {
                        return {title: 'Удаление', message: 'Удалить сущность?'};
                    }
                }
            });
            modalInstance.result.then(function () {
                diagramService.removeEntity(entity);
            });
        };
        //Добавить сущность на основе шаблона
        $scope.addTemplateEssence = function () {
            var modalInstance = $modal.open({
                templateUrl: '../app/views/selectModal.html',
                controller: 'selectModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: 'Выбор',
                            message: 'Выберите шаблон'
                        };
                    }
                }
            });
            modalInstance.result.then(function (entity) {
                diagramService.addEntity(entity);
            });
        };
    };
    angular.module('app').controller('mainCtrl', ['$scope', '$modal', 'diagramService', 'templateService', mainCtrl]);
})();