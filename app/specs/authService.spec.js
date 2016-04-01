describe('Тест authService', function () {
    var as, scope, httpBackend;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($rootScope, $injector) {
            scope = $rootScope.$new();
            as = $injector.get('authService');
            httpBackend = $injector.get('$httpBackend');

        });
    });
    it("Передаем не верный логин пароль", function () {
        httpBackend.whenPOST('/login').respond(401, 'Неверный пароль');
        as.user = {name: "petya", token: "12334567"};
        var error = false;
        var errText ='';
        as.login({login: 'petya', password: '12345'}).then(function(data){
            error = false;
        }, function (data) {
            error = true;
            errText =data;
        });
        httpBackend.expectPOST('/login');
        httpBackend.flush();
        expect(as.user).toBeUndefined();
        expect(error).toBeTruthy();
        expect(errText).toBe('Неверный пароль');
    });
    it("Передаем не верный логин пароль, падает сервер", function () {
        httpBackend.whenPOST('/login').respond(500, 'Неверный пароль');
        as.user = {name: "petya", token: "12334567"};
        var error = false;
        var errText ='';
        as.login({login: 'petya', password: '12345'}).then(function(data){
            error = false;
        }, function (data) {
            error = true;
            errText =data;
        });
        httpBackend.expectPOST('/login');
        httpBackend.flush();
        expect(as.user).toBeUndefined();
        expect(error).toBeTruthy();
        expect(errText).toBe('Ошибка сервера');
    });
    it("Передаем верный логин пароль", function () {
        httpBackend.whenPOST('/login').respond({
            login: "vasya",
            token: "12334567"
        });
        var ok = false;
        as.login({login: 'vasya', password: '12345'}).then(function () {
            ok = true;
        });
        httpBackend.expectPOST('/login');
        httpBackend.flush();
        expect(as.user).toEqual({login: "vasya", token: "12334567"});
        expect(ok).toBeTruthy();
    });
    it("Выход", function () {
        as.user = {login: '1234'};
        as.logoff();
        expect(as.user).toBeUndefined();
    });
    //закрываем все «ожидания» и запросы.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});