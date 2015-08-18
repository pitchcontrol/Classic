/**
 * Created by snekrasov on 26.05.2015.
 */
"use strict";
var fs = require('fs');
var util = require('util');
var lodash = require('lodash-node');
describe("Генератор класса", function () {
    var json, module;
    beforeEach(function () {
        module = require('../../templates/csharp/Класс');
        json = require('./Класс.json');
    });
    function prepare(str) {
        return str.replace(/\s+/g, ' ').replace(/\s$/, '');
    }

    function compare(i, fn, done) {
        module.render(json, (err, result)=> {
            var file = fs.readFileSync(fn, 'utf8');
            //console.log(result.length);
            if (Number.isInteger(i))
                expect(prepare(result[i].text)).toBe(prepare(file));
            else {
                expect(prepare(lodash.findWhere(result, {name: i}).text)).toBe(prepare(file));
            }
            done();
        });
    }

    it("Аростой класс", function (done) {
        //expect(compare(0, './spec/csharp/Класс.txt')).toBeTruthy();
        compare("myEntity.cs", 'server/spec/csharp/Класс.txt', done)
    });
    it("Класс с ассоциацией", function (done) {
        compare("myEntity2.cs", 'server/spec/csharp/Класс2.txt', done)
    });
    it("Класс с ассоциацией колекция", function (done) {
        compare("myEntity3.cs", 'server/spec/csharp/Класс3.txt', done);
    });

    //Добавляем пунк выделить интерфейс
    it("Простой класс - наследование от интерфейса", function (done) {
        json.answers[1] = true;
        compare("myEntity.cs", 'server/spec/csharp/КлассI.txt', done);
    });
    it("Простой класс - интерфейс", function (done) {
        json.answers[1] = true;
        compare('ImyEntity.cs', 'server/spec/csharp/IКласс.txt', done);
    });
    it("Класс с ассоциацией - наследование от интерфейса", function (done) {
        json.answers[1] = true;
        compare("myEntity2.cs", 'server/spec/csharp/КлассI2.txt', done);
    });
    it("Класс с ассоциацией - интерфейс", function (done) {
        json.answers[1] = true;
        compare("ImyEntity2.cs", 'server/spec/csharp/IКласс2.txt', done);
    });
    it("Класс с ассоциацией колекция - наследование от интерфейса", function (done) {
        json.answers[1] = true;
        compare("myEntity3.cs", 'server/spec/csharp/КлассI3.txt', done);
    });
    it("Класс с ассоциацией колекция - интерфейс", function (done) {
        json.answers[1] = true;
        compare("ImyEntity3.cs", 'server/spec/csharp/IКласс3.txt', done);
    });
    it("Тест класс с перечислением создается файл с enum", function (done) {
        json.answers[1] = true;
        json.entities = [];
        json.views = [];
        compare(0, 'server/spec/csharp/enum1.txt', done);
    });
    it("Класс полем c enum", function (done) {
        json = require('./classEnum.json');
        compare("myEntity.cs", 'server/spec/csharp/enum2.txt', done);
    });
    it("Тест клас поле c коментарием", function (done) {
        json = require('./classEnum.json');
        json.entities[0].fields[0].description = 'Имя';
        compare("myEntity.cs", 'server/spec/csharp/Класс4.txt', done);
    });
});