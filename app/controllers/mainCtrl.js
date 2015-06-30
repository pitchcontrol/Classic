(function () {
    "use strict";
    var mainCtrl = function ($scope, $modal, diagramService, templateService) {
        //Сущности
        $scope.diagram = diagramService;


        $scope.addEntity = function () {
            var entity = diagramService.addEntity();
            var modalInstance = $modal.open({
                templateUrl: 'views/entityModal.html',
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
                templateUrl: 'views/entityModal.html',
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
                templateUrl: 'views/confirmModal.html',
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
                templateUrl: 'views/selectModal.html',
                controller: 'selectModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: 'Выбор',
                            message: 'Выберите шаблон'
                        };
                    },
                    promise: function () {
                        return templateService.getEntityTemplateList;
                    }
                }
            });
            modalInstance.result.then(function (entity) {
                diagramService.addEntity(entity);
            });
        };
        //Генерировать
        $scope.generate = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/selectModal.html',
                controller: 'selectModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            title: 'Выбор',
                            message: 'Выберите шаблон для генерации'
                        };
                    },
                    promise: function () {
                        return templateService.getGenerateTemplateList;
                    }
                }
            });
            var id;
            //Переходим к вопросам
            modalInstance.result.then(function (template) {
                $modal.open({
                    templateUrl: 'views/wizardCtrl.html',
                    controller: 'wizardCtrl',
                    resolve: {
                        data: function () {
                            return {
                                title: 'Вопросы',
                                message: 'Пожалуйста ответьте на вопросы'
                            };
                        },
                        promise: function () {
                            id = template.id;
                            return templateService.getQuestionList(id);
                        }
                    }
                }).result.then(function (result) {
                        templateService.generate({
                            id: id,
                            answers: result.map(function (it) {
                                return it.answer;
                            }),
                            entities: diagramService.getJSON()
                        }).then(function (file) {
                            var blob = new Blob([file.data], {type: 'application/zip'});
                            saveAs(blob, 'code.zip');
                        });
                    });
            });
        };
        //Контекстное меню
        $scope.menuOptions = [['Добавить сущность', function () {
            $scope.addEntity();
        }]];

    };
    angular.module('app').controller('mainCtrl', ['$scope', '$modal', 'diagramService', 'templateService', mainCtrl]);
})();