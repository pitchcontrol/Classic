/**
 * Created by snekrasov on 08.05.2015.
 */
(function () {
    "use strict";
    var entityDraggable = function ($document, diagramService, $rootScope, geometryBlock) {
        function makeDraggable(scope, element, attr) {
            var startX = 0;
            var startY = 0;
            var x = 0;
            var y = 0;
            if (!diagramService.mouse) {
                // Start with a random pos
                x = Math.floor((Math.random() * 400));
                y = Math.floor((Math.random() * 400));
            } else {
                var rel = diagramService.geometry.getRelative(diagramService.mouse);
                x = rel.x;
                y = rel.y;
            }
            element.css({
                position: 'absolute',
                top: y + 'px',
                left: x + 'px',
                cursor: 'move'
            });
            // var rx = (x - diagramService.geometry.offsetX);
            // var ry = (y - diagramService.geometry.offsetY);
            //scope.entity.geometry = {
            //    x: x,
            //    y: y - 20,
            //    width: element.prop('offsetWidth'),
            //    height: element.prop('offsetHeight'),
            //    bottom: {x: (x + element.prop('offsetWidth') / 2), y: y - 20 + element.prop('offsetHeight')}
            //};
            scope.entity.geometry = new geometryBlock(x, y, element.prop('offsetWidth'), element.prop('offsetHeight'));

            function mousemove(event) {
                //console.log(event.pageX,event.pageY)
                y = event.pageY - startY;
                x = event.pageX - startX;
                redreaw(x, y);

            }

            function redreaw(x, y) {
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
                var geo = scope.entity.geometry;
                geo.x = x;
                geo.y = y;

                //Кидаем событе изменения положения
                $rootScope.$broadcast(scope.entity.id);
                //Кидаем изменения положения полей
                scope.entity.fields.forEach(function (item) {
                    $rootScope.$broadcast(item.id);
                });
                Refresh(geo.bottom.x, geo.bottom.y);
            }


            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                //Нужно определить наезжание блоков

                diagramService.entities.forEach(function (ent) {
                    var res = ent.geometry.intersection(scope.entity.geometry);
                    if (res != null && ent != scope.entity) {
                        x = scope.entity.geometry.x = scope.entity.geometry.x + res.x;
                        y = scope.entity.geometry.y = scope.entity.geometry.y + res.y;
                        redreaw(x, y);
                    }
                });
            }

            element.on('mousedown', function (event) {
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
            });

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
    angular.module('app').directive('entityDraggable', ['$document', 'diagramService', '$rootScope', 'geometryBlock', entityDraggable]);
})();