/**
 * Created by snekrasov on 18.06.2015.
 */
"use strict";
let authenticateError = require('../errors/authenticateError').authenticateError;
let notFoundError = require('../errors/notFoundError').notFoundError;
let errorProcessor = require('../errorProcessor');
let Serialize = require('sequelize');

describe("Тестирования templates", function () {
    var mockery, request, gen, questions;
    beforeEach(function () {
        mockery = require('mockery');
        let app = require('../services/expressInit').app;
        gen = require('../../test/entityGenerates.json');
        questions = require('../../test/questionList.json');
        let mock = {
            Generator: {
                findAll: ()=>Promise.resolve(gen),
                findById: (id)=> {
                    if (id == 1)
                        return Promise.resolve({module: "../templates/csharp/Класс"});
                    return Promise.resolve(null);
                },
                findOne: (query)=> {
                    if (query.where.name == "name1")
                        return Promise.resolve({name: "name1"});
                    else
                        return Promise.resolve(null);
                },
                build: function (obj) {
                    if (obj.build == 'success')
                        return {
                            id: 1,
                            save: function () {
                                return Promise.resolve({id: 1});
                            }
                        };
                    else
                        return {
                            id: 1,
                            save: () => {
                                return Promise.reject(new Serialize.UniqueConstraintError());
                                //throw new Serialize.UniqueConstraintError();
                            }
                        };
                }
            },
            questionsForGenerator: (id) => {
                if (id == 1)
                    return Promise.resolve(questions);
                return Promise.resolve(null);
            }
        };
        //mockery.registerMock('winston', mockWinston);
        mockery.registerMock('../model/generator', mock);

        let fsMock = {
            exists: function (path, cb) {
                if (path.match(/ok/))
                    return cb(true);
                else
                    return cb(false);
            }

        };
        mockery.registerMock('fs', fsMock);

        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});
        //Имитация аунтификации
        var auth = function () {
            var middleware = function (req, res, next) {
                req.user = {};
                if (req.body.name == 'Admin')
                    req.user.isAdmin = true;
                next();
            };
            return middleware;
        };

        app.get('/template/list', require('../routes/template').list);
        app.post('/template/add', auth(), require('../routes/template').add);
        app.get('/template/questions/:id', require('../routes/template').questions);
        app.post('/template/execute', require('../routes/template').execute);
        //app.post('/template/addnew', require('../routes/template').add);

        app.use(errorProcessor);
        request = require('supertest')(app);
    });
    it("Получить вопросы не правильный ид", function (done) {
        request.get('/template/questions/0')
            .expect(404)
            .expect('Шаблон c id:0 не найден')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Получить вопросы правильный ид", function (done) {
        request.get('/template/questions/1')
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(questions).toEqual(res.body);
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Генерация шаблон не найден", function (done) {
        request.post('/template/execute')
            .send({id: 0})
            .expect(404)
            .expect('Шаблон c id:0 не найден')
            .end((err)=>  err ? done.fail(err) : done());
    });
    function binaryParser(res, callback) {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', function (chunk) {
            res.data += chunk;
        });
        res.on('end', function () {
            callback(null, new Buffer(res.data, 'binary'));
        });
    }

    it("Генерация шаблон найден", function (done) {
        request.post('/template/execute')
            .send({
                id: 1, entities: [], answers: [
                    {"answer": "My.namespace.super"},
                    {"answer": false},
                    {"answer": "ICollection"}
                ]
            })
            .expect('Content-Type', /application\/zip/)
            .parse(binaryParser)
            .end(function (err, res) {
                if (err)
                    done.fail(err);
                else {
                    expect(Buffer.isBuffer(res.body)).toBeTruthy();
                    done();
                }
            });
    });
    it("Добавить шаблон, юзер не админ", function (done) {
        request.post('/template/add')
            .send({name: 'notAdmin'})
            .expect(401)
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Добавить шаблон, такой уже есть", function (done) {
        request.post('/template/add')
            .send({name: 'Admin', module: 'ok', build: 'error'})
            .expect(500)
            .expect('Параметры не уникальны')
            .end((err)=>  err ? done.fail(err) : done());
    });
    it('Добавить шаблон, путь не верный', function (done) {
        request.post('/template/add')
            .send({name: 'Admin', module: 'error'})
            .expect(404)
            .expect(/Модуль не найден/)
            .end((err)=>  err ? done.fail(err) : done());
    });
    it('Добавить шаблон, ок', function (done) {
        request.post('/template/add')
            .send({name: 'Admin', module: 'ok', build: 'success'})
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err)=>  err ? done.fail(err) : done());
    });
    afterEach(function () {
        mockery.disable();
        mockery.deregisterAll();
    });
});