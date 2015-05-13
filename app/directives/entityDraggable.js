/**
 * Created by snekrasov on 08.05.2015.
 */
(function () {
    "use strict";
    var entityDraggable = function ($document) {
        function makeDraggable(scope, element, attr) {
            var startX = 0;
            var startY = 0;

            // Start with a random pos
            var x = Math.floor((Math.random() * 500) + 40);
            var y = Math.floor((Math.random() * 360) + 40);

            element.css({
                cursor: 'pointer',
                position: 'absolute',
                top: y + 'px',
                left: x + 'px'
            });
            scope.entity.geometry = {x: x, y: y};

            element.on('mousedown', function (event) {
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;

                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });

                scope.entity.geometry.x = x;
                scope.entity.geometry.y = y;

            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }

        return {
            link: makeDraggable,
            scope: {
                entity: '=entity'
            }
        };
    };
    angular.module('app').directive('entityDraggable', ['$document', entityDraggable]);
})
();