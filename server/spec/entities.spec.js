/**
 * Created by snekrasov on 17.06.2015.
 */
"use strict";
describe("Тестирования Шаблоны сущностей", function () {
    var  mockery, request, entList;
    beforeEach(function () {
        mockery = require('mockery');
        var bodyParser = require('body-parser');
        var app = require('../services/expressInit').app;

        entList = require('../../test/entityTemplates.json');

        mockery.registerMock('../model/entityTemplates', {
                List: (query)=>  Promise.resolve(entList)
        });
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});

        app.get('/entities/list',require('../routes/entities.js').entities);
        request = require('supertest')(app);
    });
    it("Список шаблонов сущностей", function (done) {
        request.get('/entities/list')
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(entList).toEqual(res.body);
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    afterEach(function () {
        mockery.disable();
        mockery.deregisterAll();
    });
});