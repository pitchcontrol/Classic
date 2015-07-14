describe("Тестирования project", function () {
    var mockery, app;
    beforeEach(function () {
        mockery = require('mockery');
        //Инициализация express
        app = require('../services/expressInit').app;
        //Эмитация того что пользователь аунтифицирован
        app.use(function (req, res, next) {
            req.user = {id: 1};
            next();
        });
    });
    function getRequest(app) {
        mockery.enable({warnOnUnregistered: false, warnOnReplace: false, useCleanCache: true});
        app.post('/project/save', require('./../routes/project').save);
        app.post('/project/update', require('./../routes/project').update);
        return require('supertest')(app);
    };
    it("Проверяем а есть ли такой проект, ошибка есть", function (done) {
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=>
                    Promise.resolve({})
            }
        });
        var request = getRequest(app);
        request.post('/project/save')
            .send({projectName: 'first'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({error: 'Такой проект уже есть: first'});
            })
            .end((err)=>  err ? done.fail(err) : done());
    })
    ;
    it("Сохраняем ошибка в базе", function (done) {
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=>  Promise.resolve(null),
                build: ()=> {
                    return {save: ()=>Promise.reject('Epic fail')}
                }
            }
        });
        var request = getRequest(app);
        request.post('/project/save')
            .send({projectName: 'second'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({error: 'Ошибка сохранения проекта'});
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Обновляем проект, проект не найден", function (done) {
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=>  Promise.resolve(null)
            }
        });
        var request = getRequest(app);
        request.post('/project/update')
            .send({projectName: 'second', id: 1})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({error: 'Проект не найден'});
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Обновляем проект имя меняется, причем уже есть такой проект", function (done) {
        var count = 0;
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=> {
                    if (count == 0) {
                        count++;
                        return Promise.resolve({name: 'first'});
                    }
                    if (count == 1) {
                        count++;
                        return Promise.resolve({name: 'second'});
                    }
                    return Promise.reject();
                }
            }
        });
        var request = getRequest(app);
        request.post('/project/update')
            .send({projectName: 'second', id: 1})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({error: 'Уже есть такой проект'});
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    it("Обновляем имя не меняется все ок", function (done) {
        var count = 0;
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=>  Promise.resolve({name: 'second', id: 1, save: (obj)=>Promise.resolve()})
            }
        });
        var request = getRequest(app);
        request.post('/project/update')
            .send({projectName: 'second', id: 1})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({id: 1});
            })
            .end((err)=>  err ? done.fail(err) : done());
    });

    it("Сохраняем в базе все ок", function (done) {
        mockery.registerMock('./../model/project', {
            Project: {
                findOne: (query)=>  Promise.resolve(null),
                build: ()=> {
                    return {save: ()=>Promise.resolve(), id: 1}
                }
            }
        });
        var request = getRequest(app);
        request.post('/project/save')
            .send({projectName: 'second'})
            .expect('Content-Type', /json/)
            .expect((res)=> {
                expect(res.body).toEqual({id: 1});
            })
            .end((err)=>  err ? done.fail(err) : done());
    });
    afterEach(function () {
        mockery.deregisterAll();
    });
});