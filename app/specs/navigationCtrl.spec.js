describe('Тест navigationCtrl', function () {
    var controller, scope, modal, q, authService, ts, ds;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, $q, diagramService) {
            ds = diagramService;
            scope = $rootScope.$new();
            q = $q;
            ts = jasmine.createSpyObj('templateService', ['saveProject', 'getProjects']);
            modal = jasmine.createSpyObj('modal', ['open']);
            authService = jasmine.createSpyObj('authService', ['logoff']);
            controller = $controller('navigationCtrl', {
                $scope: scope,
                $modal: modal,
                authService: authService,
                templateService: ts
            });
        });
    });
    it("Ошибка логина", function () {
        modal.open.and.returnValue({result: q.reject({})});
        scope.login();
        scope.$digest();
        expect(modal.open).toHaveBeenCalled();
        expect(scope.model.loginTitle).toBe('Вход');
    });
    it("Успех логина", function () {
        modal.open.and.returnValue({result: q.when({})});
        ts.getProjects.and.returnValue(q.when({}));
        scope.login();
        authService.user = {
            login: 'vasya'
        };
        scope.$digest();
        expect(modal.open).toHaveBeenCalled();
        expect(scope.model.loginTitle).toBe('Выход(vasya)');
        //Сразу идет запрос проектов
        expect(ts.getProjects).toHaveBeenCalled();
    });
    it("Успех логина, полученны проекты", function () {
        modal.open.and.returnValue({result: q.when({})});
        var prjs = [{name: "prj1", id: 0}];
        ts.getProjects.and.returnValue(q.when({data: prjs}));
        scope.login();
        authService.user = {
            login: 'vasya'
        };
        scope.$digest();
        expect(scope.model.projects).toEqual(prjs);
    });
    it("Выход", function () {
        authService.user = {
            login: 'vasya'
        };
        scope.login();
        expect(authService.logoff).toHaveBeenCalled();
        expect(scope.model.loginTitle).toBe('Вход');
    });
    it("Нажимаем сохранить - отмена", function () {
        modal.open.and.returnValue({result: q.reject({})});
        scope.saveProject();
        scope.$digest();
        //Не вызывается сохранение
        expect(ts.saveProject).not.toHaveBeenCalled();
    });
    it("Нажимаем сохранить - ошибка сервера", function () {
        modal.open.and.returnValue({result: q.when({})});
        scope.saveProject();
        ts.saveProject.and.returnValue(q.reject({error: "Такой проект уже есть"}));
        scope.$digest();
        //Вызывается сохранение
        expect(ts.saveProject).toHaveBeenCalled();
        //Вызывается инфо диалог
        //Первый вызов это запрос имени, второй инфо сообщение argsFor(1)
        expect(modal.open.calls.argsFor(1)[0].resolve.data()).toEqual({
            title: 'Внимание',
            message: 'Такой проект уже есть'
        });
        expect(modal.open.calls.count()).toBe(2);
    });
    it("Нажимаем сохранить - все сохранилось", function () {
        modal.open.and.returnValue({result: q.when({})});
        ds.projectName ='First';
        scope.saveProject();
        ts.saveProject.and.returnValue(q.when({id: 101}));
        scope.$digest();
        //Вызывается сохранение
        expect(ts.saveProject).toHaveBeenCalled();
        expect(modal.open.calls.count()).toBe(1);
        expect(ds.projectId).toBe(101);
        expect(scope.model.saveTitle).toBe('Сохранить(First)');
    });
});