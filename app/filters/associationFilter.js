(function () {
    "use strict";
    angular.module('app').filter('associationFilter', function () {
        return function (items, view) {
            var filtered = [];
            //-1 главная без ограничения
            if (!view || view.id === -1) {
                return items;
            }
            items.forEach(function (association) {
                if (_.contains(view.entities, association.start) && _.contains(view.entities, association.end.entity)) {
                    filtered.push(association);
                }
            });
            return filtered;
        };
    });
})();
