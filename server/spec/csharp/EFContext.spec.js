/**
 * Created by Станислав on 09.04.2016.
 */
"use strict";
let tc = require('../../../test/textComparer');

describe("Генератор EF контекста", function () {
    var json, module,helper;
    beforeEach(function () {
        module = require('../../templates/csharp/EFContext');
        json = require('./EFContext.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
    });
    it("Простая сущность, id задан явно", function (done) {
        helper.entityCompare("myEntity", __dirname + '/EFContext1.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Простая сущность со связью 1 к 1, id не задан явно", function (done) {
        helper.entityCompare("myEntity2", __dirname + '/EFContext2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Простая сущность со связью 1 к *, id не задан явно", function (done) {
        helper.entityCompare("myEntity3", __dirname + '/EFContext3.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Проверяем файл контекста", function (done) {
        helper.compareFile("MyContext.cs", __dirname + '/EFContext.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
});