/**
 * Created by Станислав on 9/4/2015.
 */
"use strict";
let tc = require('../../../test/textComparer');
describe("mongoose контекст", function () {
    var json, module, helper;
    beforeEach(function () {
        module = require('../../templates/javascript/mongoose');
        json = require('./sequelize.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
    });
    it("Простая сушность", function (done) {
        helper.entityCompare("myEntity", __dirname + '/mongoose.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Cушность c enum", function (done) {
        helper.entityCompare("myEntity4", __dirname + '/mongooseEnum.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Cушность c один к одному", function (done) {
        helper.entityCompare("myEntity2", __dirname + '/mongoose2.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
    it("Cушность c один ко многим", function (done) {
        helper.entityCompare("myEntity3", __dirname + '/mongoose3.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
});