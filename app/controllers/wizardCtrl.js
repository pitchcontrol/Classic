(function () {
    "use strict";
    //Мастер для опросов
    var wizardCtrl = function ($scope, $modalInstance, data, promise) {
        $scope.message = data.message;
        $scope.title = data.title;
        var questions = promise.data;
        //Если вопросов нет сразу выход
        if (questions.length === 0) {
            $modalInstance.close(questions);
        }
        $scope.model = questions[0];

        $scope.ok = function () {
            $modalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        var index = 0;
        $scope.validate = function (question) {
            return question != undefined;
        };
        $scope.next = function () {
            index++;
            if (index > questions.length - 1) {
                $modalInstance.close(questions);
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
                return $scope.model.answer == undefined && model.type != 'bool'
        };
        $scope.prev = function () {
            if (index > 0) {
                index--;
                $scope.model = questions[index];
            }
        };
    };
    angular.module('app').controller('wizardCtrl', ['$scope', '$modalInstance', 'data', 'promise', wizardCtrl]);
})();