(function () {
    "use strict";
    var ngCanvas = function (diagramService, $window) {
        function link(scope, element, attr) {
            diagramService.geometry.offsetX = element.offset().left;
            diagramService.geometry.offsetY = element.offset().top + 20;
            diagramService.geometry.canvas = {width: element.prop('offsetWidth'), height: element.prop('offsetHeight')};
            //console.log(diagramService.geometry.offsetX,diagramService.geometry.offsetY);
            //element.attr('width', 1500);
            //element.attr('height', 1500);
            //Так не работает viewBox становится viewbox.
            // element.attr('viewBox', '-' + diagramService.geometry.offsetX + ' -' + diagramService.geometry.offsetY + ' 1500 1500');
            var svg = document.getElementsByTagName("svg")[0];
           // svg.setAttribute("viewBox", ' ' + diagramService.geometry.offsetX + ' ' + diagramService.geometry.offsetY + ' 1500 1500');
            angular.element($window).bind('resize', function () {
                diagramService.geometry.offsetX = element.offset().left;
                diagramService.geometry.offsetY = element.offset().top + 20;
                diagramService.geometry.canvas = {
                    width: element.prop('offsetWidth'),
                    height: element.prop('offsetHeight')
                };
               // svg.setAttribute("viewBox", ' ' + diagramService.geometry.offsetX + ' ' + diagramService.geometry.offsetY + ' 1500 1500');
            });
        }

        return {
            link: link
        };
    };
    angular.module('app').directive('ngCanvas', ['diagramService', '$window', ngCanvas]);
})();