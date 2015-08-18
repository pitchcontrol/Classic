describe('Тест navigationCtrl', function () {
    var controller, scope, modal, q, authService, ts, ds, modalService;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, $q, diagramService) {
            ds = diagramService;
            spyOn(ds, 'clear');
            scope = $rootScope.$new();
            q = $q;
            ts = jasmine.createSpyObj('templateService', ['saveProject', 'getProjects', 'deleteProject']);
            modal = jasmine.createSpyObj('modal', ['open']);
            modalService = jasmine.createSpyObj('modalService', ['info', 'select', 'confirm', 'signUp']);
            authService = jasmine.createSpyObj('authService', ['logoff', 'signUp']);
            controller = $controller('navigationCtrl', {
                $scope: scope,
                $modal: modal,
                authService: authService,
                templateService: ts,
                modalService: modalService
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
    it("Регистрация отмена пользователем", function () {
        modalService.signUp.and.returnValue(q.reject({}));
        scope.signUp();
        scope.$digest();
        expect(authService.signUp).not.toHaveBeenCalled();
    });
    it("Регистрация ок", function () {
        modalService.signUp.and.returnValue(q.when({name: "name", password: "pas"}));
        scope.signUp();
        authService.user = {
            login: 'vasya'
        };
        scope.$digest();
        expect(modalService.signUp).toHaveBeenCalled();
        expect(scope.model.loginTitle).toBe('Выход(vasya)');
    });

    it("Выход", function () {
        authService.user = {
            login: 'vasya'
        };
        scope.login();
        expect(authService.logoff).toHaveBeenCalled();
        expect(scope.model.loginTitle).toBe('Вход');
        expect(ds.clear).toHaveBeenCalled();
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
        expect(modalService.info.calls.argsFor(0)[0]).toBe('Внимание');
        expect(modalService.info.calls.argsFor(0)[1]).toBe('Такой проект уже есть');
        expect(modal.open.calls.count()).toBe(1);
    });
    it("Нажимаем сохранить - все сохранилось", function () {
        modal.open.and.returnValue({result: q.when({})});
        ds.projectName = 'First';
        scope.saveProject();
        ts.saveProject.and.returnValue(q.when({id: 101}));
        scope.$digest();
        //Вызывается сохранение
        expect(ts.saveProject).toHaveBeenCalled();
        expect(modal.open.calls.count()).toBe(1);
        expect(ds.projectId).toBe(101);
        expect(scope.model.saveTitle).toBe('Сохранить(First)');
    });
    it("Удалить проект, отмена", function () {
        //Проект выбран
        modalService.select.and.returnValue(q.when({name: "First"}));
        //На подтверждение отказ
        modalService.confirm.and.returnValue(q.reject({}));
        scope.deleteProject();
        scope.$digest();
        //Сохранение не вызывается
        expect(ts.deleteProject).not.toHaveBeenCalled();
    });
    it("Удалить проект, ошибка удаления", function () {
        //Проект выбран
        modalService.select.and.returnValue(q.when({name: "First"}));
        //На подтверждение ок
        modalService.confirm.and.returnValue(q.when({}));
        ts.deleteProject.and.returnValue(q.reject({error: "Ошибка"}));
        scope.deleteProject();
        scope.$digest();
        //Сохранение вызывается
        expect(ts.deleteProject).toHaveBeenCalled();
        //Вызывается дилог ошибки
        expect(modalService.info).toHaveBeenCalled();
    });
    it("Удалить проект ок", function () {
        //Проект выбран
        modalService.select.and.returnValue(q.when({name: "First"}));
        //На подтверждение ок
        modalService.confirm.and.returnValue(q.when({}));
        ts.deleteProject.and.returnValue(q.when({}));
        ts.getProjects.and.returnValue(q.when({}));
        scope.deleteProject();
        scope.$digest();
        //Сохранение вызывается
        expect(ts.deleteProject).toHaveBeenCalled();
        //Вызывается дилог ошибки не вызывается
        expect(modalService.info).not.toHaveBeenCalled();
        //Так же должен обновится спсок проектов
        expect(ts.getProjects).toHaveBeenCalled();
    });
});