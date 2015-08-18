(function () {
    "use strict";
    var mainCtrl = function ($scope, $modal, diagramService, templateService, modalService) {
        //Сущности
        $scope.diagram = diagramService;
        $scope.currentView = diagramService.views.first();
        //$scope.user =
        //Последний выбранный шаблон
        $scope.lastTemplate = null;
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
            var modalInstance = modalService.select('Выбор', 'Выберите шаблон для генерации', templateService.getGenerateTemplateList);

            var id;
            //Переходим к вопросам
            modalInstance.then(function (template) {
                //Сохраняем последний выбранный шаблон
                $scope.lastTemplate = template;
                modalService.wizard('Вопросы', 'Пожалуйста ответьте на вопросы', templateService.getQuestionList($scope.lastTemplate.id))
                    .then(function (result) {
                        var answers = result.map(function (it) {
                            return it.answer;
                        });
                        $scope.lastAnswers = result;
                        var project = diagramService.getJSON();
                        project.id = $scope.lastTemplate.id;
                        project.answers = answers;
                        templateService.generate(project).then(function (file) {
                            var blob = new Blob([file.data], {type: 'application/zip'});
                            saveAs(blob, 'code.zip');
                        });
                    });
            });
        };
        //Ненерировать на основе уже сформированных ответов
        $scope.generateDefault = function () {
            var answers = $scope.lastAnswers.map(function (it) {
                return it.answer;
            });
            var project = diagramService.getJSON();
            project.id = $scope.lastTemplate.id;
            project.answers = answers;
            templateService.generate(project).then(function (file) {
                var blob = new Blob([file.data], {type: 'application/zip'});
                saveAs(blob, 'code.zip');
            });
        };

        //Контекстное меню
        $scope.menuOptions = [['Добавить сущность', $scope.addEntity],
            ['Добавить перечисления', function () {
                modalService.addEnum();
            }]];
        $scope.editEnum = function (en) {
            modalService.addEnum(en);
        };
        //Добавить представление
        $scope.addView = function () {
            modalService.addViewModal();
        };
        $scope.removeView = function (view) {
            modalService.confirm('Удалить представление?', 'Удалить представление: ' + view.name + '?').then(function () {
                diagramService.views.remove(view);
            });
        };
        $scope.editView = function (view) {
            modalService.editViewModal(view);
        };
        $scope.removeEnable = function () {
            return diagramService.views.collection.length > 1 && $scope.currentView != diagramService.views.collection[0];
        };
    };
    angular.module('app').controller('mainCtrl', ['$scope', '$modal', 'diagramService', 'templateService', 'modalService', mainCtrl]);
})();