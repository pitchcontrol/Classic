(function () {
    "use strict";
    var entityModalCtrl = function ($scope, $modalInstance, $modal, diagramService, item) {
        $scope.entities = diagramService.entities;
        $scope.enums = diagramService.enums;
        var copyModel;
        var validate = function (model, create) {
            //При редактироваении create = false, Проверять не надо работаем с сылкой
            //if (diagramService.entities[model.name] && create) {
            //    model.error = model.name + ', уже есть в колекции.';
            //    return false;
            //}
            //Не должны совпадать названия
            var valid = true;
            diagramService.entities.forEach(function (i) {
                if (i.name == model.name && i !== model)
                    valid = false;
            });
            if (!valid) {
                model.error = model.name + ', уже есть в колекции.';
                if (!create)
                    model.name = copyModel.name;
                return false;
            }
            var fl = model.fields;
            //Проверяем поля
            return fl.every(function (i, index) {
                if (i.type == 'Association' && !i.association) {
                    model.error = i.name + ', выбран тип ассоциация но связь не заданна.';
                    return false;
                }
                //Перебираем все другие поля чтобы не было дублей
                if (_.where(fl, {name: i.name}).length > 1) {
                    model.error = i.name + ', уже есть.';
                    if (!create) {
                        //console.log(copyModel.fields[0].name + ', ' + copyModel.fields[1].name);
                        //console.log("i.name =" + i.name + ", fields[index].name=" + copyModel.fields[index].name + ", index=" + index);
                        i.name = copyModel.fields[index].name;
                    }
                    return false;
                }
                if (i.type == 'Association') {
                    //Добавляем связь
                    diagramService.addAssociation(i);
                }
                return true;
            });
        };
        $scope.ok = function () {
            if ($scope.model.error) {
                return;
            }
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $scope.model.error = null;
            $modalInstance.dismiss('cancel');
        };
        ////Добавляем поле
        //$scope.addField = function () {
        //    //$scope.model.fields.push(new Field($scope.model));
        //    $scope.model.addField();
        //};
        //$scope.removeField = function (index) {
        //    diagramService.removeAssociation($scope.model.fields[index]);
        //    $scope.model.fields.splice(index, 1);
        //};
        ////если item не объявлен то сущность новая
        ////if (!item)
        ////    $scope.model = diagramService.addEntity();
        ////else {
        ////    $scope.model = item;
        ////}
        $scope.model = item;
    };
    angular.module('app').controller('entityModalCtrl', ['$scope', '$modalInstance', '$modal', 'diagramService', 'item', entityModalCtrl]);
})
();