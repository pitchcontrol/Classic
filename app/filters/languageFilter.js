/**
 * Created by Станислав on 17.04.2016.
 */
(function () {
    "use strict";
    angular.module('app').filter('languageFilter', function () {
        return function (items, language) {
            if (!language || !language.name) {
                return items;
            }
            return _.filter(items, {language: language.name});
        };
    });
})();
