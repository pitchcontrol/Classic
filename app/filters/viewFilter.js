/**
 * Created by snekrasov on 30.07.2015.
 */
(function () {
    "use strict";
    angular.module('app').filter('viewFilter', function () {
        return function (items, view) {
            var filtered = [];
            //-1 главная без ограничения
            if (!view || view.id === -1) {
                return items;
            }
            view.entities.forEach(function (vent) {
                var entity = items.indexOf(vent);
                if (entity != -1)
                    filtered.push(vent);
            });
            return filtered;
        };
    });
})();
