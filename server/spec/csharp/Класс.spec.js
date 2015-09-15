/**
 * Created by snekrasov on 26.05.2015.
 */
"use strict";
var fs = require('fs');
var util = require('util');
var lodash = require('lodash-node');
let tc = require('../../../test/textComparer');
describe("Генератор класса", function () {
    var json, module,helper;
    beforeEach(function () {
        module = require('../../templates/csharp/Класс');
        json = require('./Класс.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
    });
    function prepare(str) {
        return str.replace(/\s+/g, ' ').replace(/\s$/, '');
    }

    it("Простой класс", function (done) {
        helper.entityCompare("myEntity", __dirname + '/Класс.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Класс с ассоциацией", function (done) {
        helper.entityCompare("myEntity2", __dirname + '/Класс2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Класс с ассоциацией колекция", function (done) {
        helper.entityCompare("myEntity3", __dirname + '/Класс3.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });

    //Добавляем пунк выделить интерфейс
    it("Простой класс - наследование от интерфейса", function (done) {
        //json.answers[1] = true;
        helper.setAnswer(1,true);
        helper.entityCompare("myEntity", __dirname + '/КлассI.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
        //compare("myEntity.cs", 'server/spec/csharp/КлассI.txt', done);
    });
    it("Простой класс - интерфейс", function (done) {
        helper.setAnswer(1,true);
        //compare('ImyEntity.cs', 'server/spec/csharp/IКласс.txt', done);
        helper.compareFile("ImyEntity.cs", __dirname + '/IКласс.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Класс с ассоциацией - наследование от интерфейса", function (done) {
        helper.setAnswer(1,true);
        helper.compareFile("myEntity2.cs", __dirname + '/КлассI2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
        //compare("myEntity2.cs", 'server/spec/csharp/КлассI2.txt', done);
    });
    it("Класс с ассоциацией - интерфейс", function (done) {
        //json.answers[1] = true;
        helper.setAnswer(1,true);
        helper.compareFile("ImyEntity2.cs", __dirname + '/IКласс2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
        //compare("ImyEntity2.cs", 'server/spec/csharp/IКласс2.txt', done);
    });
    it("Класс с ассоциацией колекция - наследование от интерфейса", function (done) {
        //json.answers[1] = true;
        //compare("myEntity3.cs", 'server/spec/csharp/КлассI3.txt', done);
        helper.setAnswer(1,true);
        helper.compareFile("myEntity3.cs", __dirname + '/КлассI3.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Класс с ассоциацией колекция - интерфейс", function (done) {
        //json.answers[1] = true;
        //compare("ImyEntity3.cs", 'server/spec/csharp/IКласс3.txt', done);
        helper.setAnswer(1,true);
        helper.compareFile("ImyEntity3.cs", __dirname + '/IКласс3.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Тест класс с перечислением создается файл с enum", function (done) {
        //json.answers[1] = true;
        //json.entities = [];
        //json.views = [];
        //compare(0, 'server/spec/csharp/enum1.txt', done);
        helper.setAnswer(1,true);
        helper.compareFile("Enum1.cs", __dirname + '/enum1.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Класс полем c enum", function (done) {
        json = require('./classEnum.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
        //compare("myEntity.cs", 'server/spec/csharp/enum2.txt', done);
        helper.compareFile("myEntity.cs", __dirname + '/enum2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Тест клас поле c коментарием", function (done) {
        json = require('./classEnum.json');
        json.entities[0].fields[0].description = 'Имя';
        helper = new tc.textComparer({
            module: module,
            json: json
        });
        //compare("myEntity.cs", 'server/spec/csharp/Класс4.txt', done);
        helper.compareFile("myEntity.cs", __dirname + '/Класс4.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
});