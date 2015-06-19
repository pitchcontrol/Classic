/**
 * Created by snekrasov on 08.06.2015.
 */
"use strict";
describe("Тестирования authenticate", function () {
    var mockery, request, mockCrypt;
    beforeEach(function () {
        //promise = require('bluebird');
        mockery = require('mockery');
        var app = require('../services/expressInit').app;

        //готовим моки
        let mockUser = {
            User: {
                findOne: (query)=> {
                    if (query.where.login == 'vasy')
                        return Promise.resolve({hash: 'hash...'});
                    return Promise.resolve(null);
                }
            }
        };
        mockery.registerMock('../model/user', mockUser);
        mockCrypt = {
            compare: (pass, hash, cb)=> {
                if (pass == '54321')
                    cb(null, true);
                else
                    cb(null, false);
            }
        };
        mockery.registerMock('bcrypt', mockCrypt);
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});
        app.post('/login', require('../services/authenticate').login);


        request = require('supertest')(app);
    });

    it("Не пароля или логина", function (done) {
        request.post('/login')
            .expect(401)
            .expect('Не указан логин или пароль')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Не найден логин", function (done) {
        request.post('/login')
            .send({'login': 'novasy', 'password': '12345'})
            .expect(401)
            .expect('Логин не найден: novasy')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Не совпадают хэши", function (done) {
        mockCrypt.compare = (pass, hash, cb)=> {
            cb(null, false);
        };
        mockery.registerMock('bcrypt', mockCrypt);
        mockery.enable();
        request.post('/login')
            .send({'login': 'vasy', 'password': '12345'})
            .expect(401)
            .expect("Не верный пароль")
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Все ок", function (done) {
        request.post('/login')
            .send({'login': 'vasy', 'password': '54321'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                if (res.body.login != 'vasy' || res.body == undefined)
                    throw new Error();
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    afterEach(function () {
        mockery.disable();
        mockery.deregisterAll();
    });
});
