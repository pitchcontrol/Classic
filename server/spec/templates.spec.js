/**
 * Created by snekrasov on 18.06.2015.
 */
"use strict";
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
                }
            },
            questionsForGenerator: (id) => {
                if (id == 1)
                    return Promise.resolve(questions);
                return Promise.resolve(null);
            }
        };
        mockery.registerMock('../model/generator', mock);
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false});

        app.get('/template/list', require('../routes/template').list);
        app.get('/template/questions/:id', require('../routes/template').questions);
        app.post('/template/execute', require('../routes/template').execute);

        request = require('supertest')(app);
    });
    it("Список генераторов", function (done) {
        request.get('/template/list')
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(gen).toEqual(res.body);
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Получить вопросы не правильный ид", function (done) {
        request.get('/template/questions/0')
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
    afterEach(function () {
        mockery.disable();
        mockery.deregisterAll();
    });
});