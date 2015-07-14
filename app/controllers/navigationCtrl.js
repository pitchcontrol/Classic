(function () {
    "use strict";
    //Определяет логику работы менюшки
    var navigationCtrl = function ($scope, $modal, authService, templateService, diagramService) {
        $scope.model =
        {
            loginTitle: 'Вход',
            saveTitle: 'Сохранить'
        };
        $scope.login = function () {
            if (authService.user) {
                authService.logoff();
                $scope.model.loginTitle = 'Вход';
                return;
            }
            //Вход
            $modal.open({
                templateUrl: 'views/loginModal.html',
                controller: 'loginModalCtrl',
                resolve: {}
            }).result.then(function () {
                    $scope.model.loginTitle = 'Выход(' + authService.user.login + ')';
                    $scope.model.isAunt = true;
                    //Сразу обновим проекты
                    getProjects();
                });
        };
        //Сохрнанить проект
        $scope.saveProject = function () {
            //Открываем дилог выбора имени
            var modalInstance = $modal.open({
                templateUrl: 'views/enterNameModal.html',
                controller: 'enterNameModalCtrl'
            });
            modalInstance.result.then(function () {
                var result;
                if (diagramService.projectId != undefined) {
                    var res = diagramService.getJSON(true);
                    res.id = diagramService.projectId;
                    result = templateService.updateProject(res);
                }
                else {
                    //Отправляем на сервер
                    result = templateService.saveProject(diagramService.getJSON(true));
                }
                result.then(function (res) {
                    diagramService.projectId = res.id;
                    $scope.model.saveTitle = 'Сохранить(' + diagramService.projectName + ')';
                }, function (res) {
                    $modal.open({
                        templateUrl: 'views/infoModal.html',
                        controller: 'infoModalCtrl',
                        resolve: {
                            data: function () {
                                return {
                                    title: 'Внимание',
                                    message: res.error || 'Ошибка сохранения'
                                };
                            }
                        }
                    });
                });
            });
        };
        //Получить все проекты для пользователя
        function getProjects() {
            templateService.getProjects().then(function (prj) {
                $scope.model.projects = prj.data;
            });
        };
        //Загрузить проект
        $scope.loadProject = function (id) {
            templateService.loadProject(id).then(function (prj) {
                    diagramService.loadProject(prj.data);
                    $scope.model.saveTitle = 'Сохранить(' + diagramService.projectName + ')';
                }
            );
        };
    };
    angular.module('app').controller('navigationCtrl', ['$scope', '$modal', 'authService', 'templateService', 'diagramService', navigationCtrl]);
})();