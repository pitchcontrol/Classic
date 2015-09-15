/**
 * Created by snekrasov on 26.08.2015.
 */
"use strict";
let tc = require('../../../test/textComparer');
describe("Генератор формы Bootstrap", function () {
    var module, json, helper;
    beforeEach(function () {
        module = require('../../templates/html/bootstrap-form');
        json = require('./../html/form.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
    });
    it("Простая форма", function (done) {
        helper.entityCompare("myEntity", __dirname + '/bootstrap-form1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Простая форма, вся страница", function (done) {
        helper.setAnswer(0,true);
        helper.entityCompare("myEntity", __dirname + '/bootstrap-form-full1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Форма с select", function (done) {
        helper.entityCompare("myEntity4", __dirname + '/bootstrap-form2.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
});
