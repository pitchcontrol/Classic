/**
 * Created by snekrasov on 08.06.2015.
 */
"use strict";
let authenticateError = require('../errors/authenticateError').authenticateError;
describe("Тестирования authenticate", function () {
    var mockery, request, mockCrypt, mockWinston;
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
                },
                build: ()=> {
                    return {save: ()=>Promise.resolve(), id: 1}
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
            },
            //hash: (password, salt, cb)=> {
            //    cb(null, 'Hash...');
            //},
            //genSalt: (rounds, cb)=> {
            //    cb(null, 'Salt...');
            //}
        };
        mockWinston = {
            info :()=>{},
            log :()=>{},
            error :()=>{}
        };
        mockery.registerMock('winston',mockWinston);
        mockery.registerMock('bcrypt-nodejs', mockCrypt);
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});
        app.post('/login', require('../services/authenticate').login);
        app.post('/signup', require('../services/authenticate').signup);
        app.use(function (err, req, res, next) {
            if (err instanceof authenticateError) {
                res.status(401).send(err.message);
            } else if (err instanceof Error) {
                res.status(500).send('Ошибка');
            }
           return;
        });

        request = require('supertest')(app);
    });

    it("Аунтификация. Нет пароля или логина", function (done) {
        request.post('/login')
            .expect(401)
            .expect('Не указан логин или пароль')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Аунтификация. Не найден логин", function (done) {
        request.post('/login')
            .send({'login': 'novasy', 'password': '12345'})
            .expect(401)
            .expect('Логин не найден: novasy')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Аунтификация. Не совпадают хэши", function (done) {
        mockCrypt.compare = (pass, hash, cb)=> {
            cb(null, false);
        };
        mockery.registerMock('bcrypt-nodejs', mockCrypt);
        mockery.enable();
        request.post('/login')
            .send({'login': 'vasy', 'password': '12345'})
            .expect(401)
            .expect("Не верный пароль")
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Аунтификация. Все ок", function (done) {
        request.post('/login')
            .send({'login': 'vasy', 'password': '54321'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                if (res.body.login != 'vasy' || res.body == undefined)
                    throw new Error();
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Регистрация. Нет пароля или логина", function (done) {
        request.post('/signup')
            .expect(401)
            .expect('Не указан логин или пароль')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Регистрация. Такой логин уже есть", function (done) {
        request.post('/signup')
            .send({'login': 'vasy', 'password': '12345'})
            .expect(401)
            .expect('Такой логин уже есть: vasy')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Регистрация. Все ок", function (done) {
        request.post('/signup')
            .send({'login': 'novasy', 'password': '54321'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                if (res.body.login == 'vasy' || res.body.token == undefined)
                    throw new Error();
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    afterEach(function () {
        mockery.disable();
        mockery.deregisterAll();
    });
});
