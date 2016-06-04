(function () {
    "use strict";
    var universalModalCtrl = function ($scope, data, $uibModalInstance) {
        $scope.data = data;
        //$scope.validate = function (obj) {
        //    delete obj.error;
        //    obj.fields.forEach(function (item) {
        //        if (item.required && !item.value)
        //            obj.error = "Поле" + item.name + "обязательное!";
        //    });
        //};
        $scope.ok = function () {
            delete $scope.data.error;
            data.method(data.model).then(function () {
                $uibModalInstance.close($scope.model);
            }, function (error) {
                $scope.data.error = error.data || error;
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('universalModalCtrl', ['$scope', 'data', '$uibModalInstance', universalModalCtrl]);
})();