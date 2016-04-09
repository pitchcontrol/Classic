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
    it("Простоая сущность", function (done) {
        helper.entityCompare("myEntity", __dirname + '/EFContext1.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });
});