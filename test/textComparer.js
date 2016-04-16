/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let async = require('async');
let fs = require('fs');
let lodash = require('lodash-node');
let format = require('string-format');
let tools = require('../server/services/tools');

function prepare(str) {
    return str.replace(/\s+/g, ' ').replace(/\s$/, '');
}
function compare(expect, actual) {
    let exp = expect.split(/\r?\n/);
    if (!actual)
        return "Полученное значение пустое";
    let act = actual.split(/\r?\n/);
    if (act.length !== exp.length)
        return format("Данные имеют разное количество строк {0} и {1}", exp.length, act.length);
    for (let i = 0; i < act.length; i++) {
        if (exp[i] !== act[i]) {
            if (exp[i].length == act[i].length)
                return format("Строка: {0} имеет различие. Ожидаемое: '{1}' и актуальное: '{2}'", i, exp[i], act[i]);
            else
                return format("Строка: {0} имеет различие. Ожидаемое: '{1}' и актуальное: '{2}', длинны отличаются {3} и {4}", i, exp[i], act[i], exp[i].length, act[i].length);
        }
    }
    return '';
}
function getActual(collection, fileName, done) {
    let actual;
    if (Number.isInteger(fileName)) {
        return collection[fileName].text;
    } else {
        let found = lodash.findWhere(collection, {name: fileName});
        if (found == undefined) {
            let files = tools.join(collection, ",", (item)=> {
                return item.name;
            });
            done("Не найден файл: " + fileName + ", файлы: " + files);
            return null;
        }
        return found.text;
    }
}

/**
 * Конструирует обьект хелпер для сравнения
 * @param {Object} init настройка обьекта
 * @constructor
 */
function TextComparer(init) {
    this.module = init.module;
    this.json = init.json;
    this.encoding = init.encoding || 'utf8';
}

module.exports.textComparer = TextComparer;

/**
 * Сравнить файла из колекции и файла образца
 * @param {string} fileName имя файла в колекции
 * @param {string} example имя файла образца
 * @param {function} done функция окончания сравнения
 */
TextComparer.prototype.compareFile = function (fileName, example, done) {
    let self = this;
    async.parallel([
        function (call) {
            fs.readFile(example, self.encoding, call);
        },
        function (call) {
            self.module.render(self.json, call)
        }
    ], (err, results)=> {
        if (err)
            throw err;
        if (results[1] == undefined || results[1].length == 0) {
            done("Нет отрендеренных файлов");
            return;
        }
        //Если ничего не указанно то берем первый
        fileName = fileName || 0;
        let actual = getActual(results[1], fileName, done);
        if (actual == null)
            return;
        done(compare(results[0], actual));
    });
};
/**
 * Сравнить файла из колекции и файла образца из
 * директории указанной testDirectory
 * @param {string} fileName имя файла в колекции
 * @param {function} done функция окончания сравнения
 */
TextComparer.prototype.compareFileFromDirectory = function (fileName, done) {
    let fn = this.testDirectory + "/" + fileName;
    this.compareFile(fileName, fn, done);
};
TextComparer.prototype.compareText = function (fileName, text, done) {
    let self = this;
    self.module.render(self.json, (err, results)=> {
        if (err)
            throw err;
        if (results.length == 0) {
            done("Нет отрендеренных файлов");
            return;
        }
        //Если ничего не указанно то берем первый
        fileName = fileName || 0;
        let actual = getActual(results, fileName, done);
        done(compare(text, actual));
    });
};
TextComparer.prototype.setAnswer = function (number, answer) {
    let self = this;
    let temp = Object.create(self.json);
    temp.answers = Object.create(temp.answers);
    temp.answers[number] = answer;
    self.json = temp;
};
TextComparer.prototype.entityCompare = function (entityName, example, done) {
    let self = this;
    async.parallel([
        function (call) {
            fs.readFile(example, self.encoding, call);
        },
        function (call) {
            let temp = Object.create(self.json);
            temp.entities = temp.entities.filter((i)=>i.name == entityName);
            if (temp.entities.length == 0) {
                done("Нет сушностей с именем: " + entityName);
            }
            self.module.render(temp, call)
        }
    ], (err, results)=> {
        if (err)
            throw err;
        if (results[1] == undefined || results[1].length == 0) {
            done("Нет отрендеренных файлов");
            return;
        }
        //console.log("Render",results);
        done(compare(results[0], results[1][0].text));
    });
};
