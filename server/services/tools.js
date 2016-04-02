/**
 * Created by Станислав on 9/2/2015.
 */
"use strict";
/**
 * Перебор дочерней колекции
 * @param {Array} collection основная колелекция
 * @param {string} property название дочернего поля коллекции
 * @param {function} callback функция обратного вызова
 */
module.exports.forEachMany = function (collection, property, callback) {
    collection.forEach((item)=> {
        item[property].forEach(callback)
    });
};
/**
 * Объеденить элементы массива
 * @param {Array} collection колелекция
 * @param {string} separator разделитель
 * @param {function} callback функция обратного вызова
 * @returns {string} объедененная строка
 */
module.exports.join = function (collection, separator, callback) {
    let result = '';
    for (let i = 0; i < collection.length; i++) {
        result += callback(collection[i]) + separator;
    }
    return result.substr(0, result.length - separator.length);
};