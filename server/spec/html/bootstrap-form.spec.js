/**
 * Created by snekrasov on 26.08.2015.
 */
"use strict";
let tc = require('../../../test/textComparer');
describe("Генератор формы Bootstrap", function () {
    var module, json;
    beforeEach(function () {
        module = require('../../templates/html/bootstrap-form');
        json = require('./../html/form.json');
    });
    it("Простая форма", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });

        helper.entityCompare("myEntity", __dirname + '/bootstrap-form1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
    it("Простая форма, вся страница", function (done) {
        let helper = new tc.textComparer({
            module: module,
            json: json
        });
        helper.setAnswer(0,true);
        helper.entityCompare("myEntity", __dirname + '/bootstrap-form-full1.html', (error)=> {
            expect(error).toBe('');
            done();
        })
    });
});
