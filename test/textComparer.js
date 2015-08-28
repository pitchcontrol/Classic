/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let async = require('async');
let fs = require('fs');
let lodash = require('lodash-node');
let format = require('string-format');

function prepare(str) {
    return str.replace(/\s+/g, ' ').replace(/\s$/, '');
}
function compare(expect, actual) {
    let exp = expect.split(/\r?\n/);
    let act = actual.split(/\r?\n/);
    if (act.length !== exp.length)
        return format("Данные имеют разное количество строк {0} и {1}", exp.length, act.length);
    for (let i = 0; i < act.length; i++) {
        if (exp[i] !== act[i]) {
            return format("Строка: {0} имеет различие. '{1}' и '{2}'", i, exp[i], act[i]);
        }
    }
    return '';
}


function TextComparer(init) {
    this.module = init.module;
    this.json = init.json;
    this.encoding = init.encoding || 'utf8';
}
module.exports.textComparer = TextComparer;


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
        if (!fileName)
            fileName = 0;
        let actual = Number.isInteger(fileName) ? results[1][fileName].text : lodash.findWhere(results[1], {name: fileName}).text;
        done(compare(results[0], actual));
    });
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
        if (!fileName)
            fileName = 0;
        let actual = Number.isInteger(fileName) ? results[fileName].text : lodash.findWhere(results, {name: fileName}).text;
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
