(function () {
    "use strict";
    //Директива будет пересчитывать положения поля
    var fieldDraggable = function ($rootScope, diagramService) {
        function link(scope, element, attr) {
            var id = scope.field.entity.id;
            scope.field.geometry = {right: {}};
            var refresh = function () {
                scope.field.geometry.x = element.prop('offsetLeft') + scope.field.entity.geometry.x;
                scope.field.geometry.y = element.prop('offsetTop') + scope.field.entity.geometry.y;
                scope.field.geometry.right.x = scope.field.geometry.x + element.prop('offsetWidth');
                scope.field.geometry.right.y = scope.field.geometry.y + element.prop('offsetHeight') / 2;
                //Выставление окончаний связей
                if (scope.field.associationObj && scope.field.associationObj.relation) {
                    scope.field.associationObj.relation.setEnd(scope.field.geometry.right.x, scope.field.geometry.right.y);
                }
                //Кидаем событие движения поля
                $rootScope.$broadcast(scope.field.id);
            };
            refresh();
            var handler = scope.$on(id, refresh);
            //Отвязываемся от событий
            scope.$on("$destroy", function () {
                handler();
            });
        }

        return {
            link: link,
            scope: {
                field: '=field'
            }
        };
    };
    angular.module('app').directive('fieldDraggable', ['$rootScope', 'diagramService', fieldDraggable]);
})
();