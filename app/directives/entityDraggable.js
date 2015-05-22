/**
 * Created by snekrasov on 08.05.2015.
 */
(function () {
    "use strict";
    var entityDraggable = function ($document, diagramService, $rootScope) {
        function makeDraggable(scope, element, attr) {
            var startX = 0;
            var startY = 0;

            // Start with a random pos
            var x = Math.floor((Math.random() * 400) + 40);
            var y = Math.floor((Math.random() * 400) + 40);

            element.css({
                cursor: 'pointer',
                position: 'absolute',
                top: y + 'px',
                left: x + 'px'
            });
            // var rx = (x - diagramService.geometry.offsetX);
            // var ry = (y - diagramService.geometry.offsetY);
            scope.entity.geometry = {
                x: x,
                y: y - 20,
                width: element.prop('offsetWidth'),
                height: element.prop('offsetHeight'),
                bottom: {x: (x + element.prop('offsetWidth') / 2), y: y - 20 + element.prop('offsetHeight')}
            };

            element.on('mousedown', function (event) {
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                //console.log(event.pageX,event.pageY)
                y = event.pageY - startY;
                x = event.pageX - startX;

                if (x > diagramService.geometry.canvas.width - scope.entity.geometry.width) {
                    x = diagramService.geometry.canvas.width - scope.entity.geometry.width;
                }
                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                if (y > diagramService.geometry.canvas.height - scope.entity.geometry.height) {
                    y = diagramService.geometry.canvas.height - scope.entity.geometry.height
                }
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
                //console.log(x,y);
                var geo = scope.entity.geometry;
                geo.x = x; //- diagramService.geometry.offsetX;
                geo.y = y - 20; //- diagramService.geometry.offsetY;
                geo.bottom.y = geo.y + scope.entity.geometry.height;
                geo.bottom.x = geo.x + scope.entity.geometry.width / 2;
                Refresh(geo.bottom.x, geo.bottom.y);
                //Кидаем событе изменения положения
                $rootScope.$broadcast(scope.entity.id);
                //Кидаем изменения положения полей
                scope.entity.fields.forEach(function (item) {
                    $rootScope.$broadcast(item.id);
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }

            //Пробегаем по связям в сущности и меняем положение концов
            function Refresh(x, y) {
                //console.log(x, y);
                scope.entity.outerAssociation.forEach(function (item) {
                    item.relation.setStart(x, y);
                });
                scope.$apply();
            }

            //Нужно отслеживать измение колекции полей чтобы персчитывать размеры
            scope.$watch('entity.fields.length', function () {
                scope.entity.geometry.height = element.prop('offsetHeight');
                //console.log('height=' + scope.entity.geometry.height);
            });
        }

        return {
            link: makeDraggable,
            scope: {
                entity: '=entity'
            }
        };
    };
    angular.module('app').directive('entityDraggable', ['$document', 'diagramService', '$rootScope', entityDraggable]);
})();