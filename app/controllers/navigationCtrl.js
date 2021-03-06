(function () {
    "use strict";
    //Определяет логику работы менюшки
    var navigationCtrl = function ($scope, $uibModal, authService, templateService, diagramService, modalService) {
        $scope.model =
        {
            loginTitle: 'Вход',
            saveTitle: 'Сохранить',
            projectId: diagramService.projectId
        };
        $scope.login = function () {
            if (authService.user) {
                authService.logoff();
                $scope.model.loginTitle = 'Вход';
                diagramService.clear();
                $scope.model.isAunt = false;
                delete $scope.model.saveTitle;
                return;
            }
            //Вход
            $uibModal.open({
                templateUrl: 'views/loginModal.html',
                controller: 'loginModalCtrl',
                resolve: {}
            }).result.then(function () {
                    $scope.model.loginTitle = 'Выход(' + authService.user.login + ')';
                    $scope.model.isAunt = true;
                $scope.model.isAdmin = authService.user.isAdmin;
                    //Сразу обновим проекты
                    getProjects();
                });
        };
        //регистрация
        $scope.signUp = function () {
            modalService.signUp().then(function () {
                $scope.model.loginTitle = 'Выход(' + authService.user.login + ')';
                $scope.model.isAunt = true;
            });
        };
        //Сохрнанить проект
        $scope.saveAsProject = function () {
            //Открываем дилог выбора имени
            var modalInstance = $uibModal.open({
                templateUrl: 'views/enterNameModal.html',
                controller: 'enterNameModalCtrl'
            });
            modalInstance.result.then(function () {
                var result;
                if (diagramService.projectId != undefined) {
                    result = templateService.updateProject(diagramService.getJSON(true));
                }
                else {
                    //Отправляем на сервер
                    result = templateService.saveProject(diagramService.getJSON(true));
                }
                result.then(function (res) {
                    if (res.data.error) {
                        modalService.info('Внимание', res.data.error);
                        return;
                    }
                    diagramService.projectId = res.data.id;
                    $scope.model.saveAsTitle = 'Сохранить как (' + diagramService.projectName + ')';
                    $scope.model.saveTitle = 'Сохранить (' + diagramService.projectName + ')';
                }, function (res) {
                    modalService.info('Внимание', res.data.error || 'Ошибка сохранения');
                });
            });
        };
        //Сохранить проект без запроса имени
        $scope.saveProject = function () {
            if(diagramService.projectId === undefined)
            {
                $scope.saveAsProject();
                return;
            }
            var result = templateService.updateProject(diagramService.getJSON(true));
            result.then(function (res) {
                if (res.data.error) {
                    modalService.info('Внимание', res.data.error);
                    return;
                }
                $scope.model.saveAsTitle = 'Сохранить как (' + diagramService.projectName + ')';
                $scope.model.saveTitle = 'Сохранить (' + diagramService.projectName + ')';
            }, function (res) {
                modalService.info('Внимание', res.data.error || 'Ошибка сохранения');
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
                $scope.model.saveAsTitle = 'Сохранить как (' + diagramService.projectName + ')';
                $scope.model.saveTitle = 'Сохранить (' + diagramService.projectName + ')';
                }
            );
        };
        //Удалить проект
        $scope.deleteProject = function () {
            modalService.select('Удалить проект', 'Выберете проет для удаления', templateService.getProjects).then(function (prj) {
                //Проект выбран
                modalService.confirm('Удалить проект', 'Вы уверенны что хотите удалить проект? ' + prj.name).then(function () {
                    templateService.deleteProject(prj.id).then(function () {
                        //После удаления обновим список проектов
                        getProjects();
                    }, function (res) {
                        modalService.info('Внимание', res.error || 'Ошибка сохранения');
                    });
                });
            });
        };
        //Очистить проект
        $scope.clearProject = function () {
            diagramService.clear();
            $scope.model.saveTitle = 'Сохранить';
        };
    };
    angular.module('app').controller('navigationCtrl', ['$scope', '$uibModal', 'authService', 'templateService', 'diagramService', 'modalService', navigationCtrl]);
})();