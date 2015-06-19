(function () {
    "use strict"
    //Мастер для опросов
    var wizardCtrl = function ($scope, $modalInstance, data, promise) {
        $scope.message = data.message;
        $scope.title = data.title;
        var questions = promise.data;
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
            }
            $scope.model = questions[index];
        };
        $scope.hasPrev = function () {
            return index != 0;
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