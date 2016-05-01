/**
 * Created by Станислав on 01.05.2016.
 */
(function () {
    "use strict";
    //Для работы с генераторами из админки
    var generatorCtrl = function ($scope, templateService, modalService, $timeout) {
        $scope.model = {};

        function refresh() {
            templateService.getGenerateTemplateList().then(function (result) {
                $scope.items = result.data
            });
        }

        refresh();
        $scope.addGenerator = function () {
            modalService.addGenerator().then(function () {
                $scope.model.success = 'Успешно добавлен';
                $timeout(2000, function () {
                    delete $scope.model.success;
                });
                refresh();
            });
        };
    };
    angular.module('app').controller('generatorCtrl', ['$scope', 'templateService', 'modalService', '$timeout', generatorCtrl]);
})();