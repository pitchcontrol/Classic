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
        httpBackend.whenPOST('/login').respond(401);
        as.user = {name: "petya", token: "12334567"};
        var error = false;
        as.login({login: 'petya', password: '12345'}).then(null, function () {
            error = true;
        });
        httpBackend.expectPOST('/login');
        httpBackend.flush();
        expect(as.user).toBeUndefined();
        expect(error).toBeTruthy();
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