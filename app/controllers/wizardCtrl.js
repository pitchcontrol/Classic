(function () {
    "use strict";
    //Мастер для опросов
    var wizardCtrl = function ($scope, $uibModalInstance, data, promise) {
        $scope.message = data.message;
        $scope.title = data.title;
        var questions = promise.data;
        //Если вопросов нет сразу выход
        if (questions.length === 0) {
            $uibModalInstance.close(questions);
        }
        $scope.model = questions[0];

        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var index = 0;
        $scope.validate = function (question) {
            return question != undefined;
        };
        $scope.next = function () {
            index++;
            if (index > questions.length - 1) {
                $uibModalInstance.close(questions);
            } else {
                $scope.model = questions[index];
                if ($scope.model.default != undefined) {
                    $scope.model.answer = $scope.model.default;
                }
            }
        };
        $scope.hasPrev = function () {
            return index != 0;
        };
        $scope.hasNext = function () {
            if (questions.length === 0)
                return true;
            else
                return $scope.model.answer != undefined || $scope.model.type == 'bool'
        };
        $scope.prev = function () {
            if (index > 0) {
                index--;
                $scope.model = questions[index];
            }
        };
    };
    angular.module('app').controller('wizardCtrl', ['$scope', '$uibModalInstance', 'data', 'promise', wizardCtrl]);
})();