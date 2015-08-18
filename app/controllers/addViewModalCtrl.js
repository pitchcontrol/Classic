(function () {
    "use strict";
    var addViewModalCtrl = function ($scope, $modalInstance, diagramService, data) {
        $scope.init = function (views) {
            $scope.model = views ? {name: views.name} : {name: ''};
            $scope.model.entities = diagramService.entities.map(function (item) {
                var obj = item.getJSON();
                obj.id = item.id;
                obj.parent = item;
                //Если мы редактируем то не все нужно выделять
                if (!views)
                    obj.included = true;
                else {
                    obj.included = _.contains(views.entities, item);
                }
                return obj;
            });
        };
        $scope.init(data);
        $scope.ok = function () {
            if (!$scope.model.name) {
                $scope.model.error = 'Название не указанно';
                return;
            }
            if (diagramService.views.collection.some(function (it) {
                    return it.name == $scope.model.name && it != data
                })) {
                $scope.model.error = 'Уже есть такое представление';
                return;
            }
            var entities = _.where($scope.model.entities, {included: true});
            if (!entities || entities.length == 0) {
                $scope.model.error = 'Не выбранна ни одной сущности';
                return;
            }
            //Нужно проверить что-бы не было ассоциаций источники которых выпали из представления
            for (var i = 0; i < entities.length; i++) {
                var item = entities[i];
                for (var j = 0; j < item.fields.length; j++) {
                    var field = item.fields[j];
                    if (field.associationObj) {
                        var name = field.associationObj.start.name;
                        var find = _.findWhere(entities, {name: name});
                        if (!find) {
                            $scope.model.error = 'Сущность ' + item.name + ', связанна с ' + name + ' но она не добвленна.';
                            return;
                        }
                    }
                }
            }
            if (!data) {
                var newView = diagramService.views.addItem();
                newView.name = $scope.model.name;
                newView.entities = _.pluck(entities, 'parent');
            }
            else {
                data.name = $scope.model.name;
                data.entities = _.pluck(entities, 'parent');
            }
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $scope.model.error = null;
            $modalInstance.dismiss('cancel');
        };
    };
    angular.module('app').controller('addViewModalCtrl', ['$scope', '$modalInstance', 'diagramService', 'data', addViewModalCtrl]);
})();