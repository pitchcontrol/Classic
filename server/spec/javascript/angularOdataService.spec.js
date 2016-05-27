/**
 * Created by Станислав on 27.05.2016.
 */
"use strict";
let tc = require('../../../test/textComparer');
describe("odata angular сервис", function () {
    var json, module, helper;
    beforeEach(function () {
        module = require('../../templates/javascript/angularOdataService');
        json = require('./angularOdataService.json');
        helper = new tc.textComparer({
            module: module,
            json: json
        });
    });
    it("Простая сушность", function (done) {
        helper.entityCompare("myEntity", __dirname + '/angularOdataService.txt', (error)=> {
            expect(error).toBe('');
            done();
        });
    });

});