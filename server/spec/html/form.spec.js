/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let tc = require('../../../test/textComparer');
describe("Генератор формы", function () {
    var module, json;
    beforeEach(function () {
        module = require('../../templates/html/form');
        json = require('./../html/form.json');
    });
    it("Простая форма", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });

        helper.entityCompare("myEntity", __dirname + '/form1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Форма с select", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });
        helper.entityCompare("myEntity4", __dirname + '/form2.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Полная форма c заголовком", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });
        helper.setAnswer(0, true);
        helper.entityCompare("myEntity", __dirname + '/formFull1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Форма с ассоциацией", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });
        helper.entityCompare("myEntity2", __dirname + '/form3.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
});