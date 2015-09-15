/**
 * Created by ��������� on 9/2/2015.
 */
"use strict";
/**
 * ������� �������� ��������
 * @param {Array} collection �������� ����������
 * @param {string} property �������� ��������� ���� ���������
 * @param {function} callback ������� ��������� ������
 */
module.exports.forEachMany = function (collection, property, callback) {
    collection.forEach((item)=> {
        item[property].forEach(callback)
    });
};
/**
 * ���������� �������� �������
 * @param {Array} collection ����������
 * @param {string} separator �����������
 * @param {function} callback ������� ��������� ������
 * @returns {string} ������������ ������
 */
module.exports.join = function (collection, separator, callback) {
    let result = '';
    for (let i = 0; i < collection.length; i++) {
        result += callback(collection[i]) + separator;
    }
    return result.substr(0, result.length - separator.length);
};