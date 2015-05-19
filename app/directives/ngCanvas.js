(function () {
    "use strict";
    var ngCanvas = function (diagramService) {
        function link(scope, element, attr) {
            diagramService.geometry.offsetX = element.prop('offsetLeft');
            diagramService.geometry.offsetY = element.prop('offsetTop') + 20;
            //console.log(diagramService.geometry.offsetX,diagramService.geometry.offsetY);
        }

        return {
            link: link
        };
    };
    angular.module('app').directive('ngCanvas', ['diagramService', ngCanvas]);
})();