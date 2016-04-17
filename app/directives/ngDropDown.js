/**
 * Created by Станислав on 02.04.2016.
 */
(function () {
    "use strict";
    var ngDropDown = function (templateService) {
        function link(scope, element, attr) {
            templateService[scope.method]().then(function(responce){
                scope.items = responce.data
            });
        }

        return {
            restrict: 'E',
            template: '<select ng-model="currentItem" ng-class="itemClass" ng-options="i as i.name for i in items"></select>',
            replace: true,
            link: link,
            scope: {
                itemClass: '@',
                currentItem:'=',
                method: '@'
            }
        };
    };
    angular.module('app').directive('ngDropDown', ['templateService', ngDropDown]);
})();