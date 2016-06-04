describe('Тест mainCtrl', function () {
    var controller, scope, modal, ds, q, ts, modalService;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, diagramService, $q) {
            ds = diagramService;
            q = $q;
            ts = jasmine.createSpyObj('templateService', ['saveProject', 'getQuestionList', 'generate']);
            scope = $rootScope.$new();
            modal = jasmine.createSpyObj('modal', ['open']);
            modalService = jasmine.createSpyObj('modalService', ['select', 'selectGenerator', 'wizard', 'confirm']);
            controller = $controller('mainCtrl', {
                $scope: scope,
                $uibModal: modal,
                templateService: ts,
                modalService: modalService
            });
        });
    });
    it("Добавление новой сущности", function () {
        modal.open.and.returnValue({result: q.when({})});
        scope.addEntity();
        scope.$digest();
        expect(modal.open).toHaveBeenCalled();
        expect(ds.entities.length).toBe(1);
    });
    it("Добавление новой сущности а потом отказ", function () {
        modal.open.and.returnValue({result: q.reject({})});
        scope.addEntity();
        scope.$digest();
        expect(modal.open).toHaveBeenCalled();
        expect(ds.entities.length).toBe(0);
    });
    it("Редактирование сущности", function () {
        scope.editEntity({});
        expect(modal.open).toHaveBeenCalled()
    });
    it("Удаляем сущность появляется диалог, но юзер говорит нет", function () {
        var entity = ds.addEntity();
        //Добавилась сушность
        expect(ds.entities.length).toBe(1);
        modal.open.and.returnValue({result: q.reject({})});
        scope.removeEntity(entity);
        scope.$digest();
        expect(ds.entities.length).toBe(1);
    });
    it("Удаляем сущность появляется диалог, но юзер говорит да", function () {
        var entity = ds.addEntity();
        //Добавилась сушность
        expect(ds.entities.length).toBe(1);
        modal.open.and.returnValue({result: q.when({})});
        scope.removeEntity(entity);
        scope.$digest();
        expect(ds.entities.length).toBe(0);
    });
    it("Открываем диалог выбора сущности по шаблону - отмена", function () {
        modal.open.and.returnValue({result: q.reject({})});
        scope.addTemplateEssence();
        scope.$digest();
        expect(ds.entities.length).toBe(0);
    });
    it("Открываем диалог выбора сущности по шаблону - ок", function () {
        modal.open.and.returnValue({result: q.when()});
        scope.addTemplateEssence();
        scope.$digest();
        expect(ds.entities.length).toBe(1);
    });
    it("Нажимаем генерировать, шаблон выбран. Но пользователь не ответил на вопросы", function () {
        var template = {name: 'fake'};
        modalService.selectGenerator.and.returnValue(q.when(template));
        modalService.wizard.and.returnValue(q.reject());
        scope.generate();
        scope.$digest();
        expect(scope.lastTemplate).toEqual(template);
    });
    it("Нажимае генерировать на основе старых ответов", function () {
        scope.lastTemplate = {name: "Класс"};
        scope.lastAnswers = [];
        ts.generate.and.returnValue(q.reject());
        scope.generateDefault();
        scope.$digest();
        //Сразу вызывается метод генерации
        expect(ts.generate).toHaveBeenCalled();
    });
    it("Удалить представление, отказ", function () {
        modalService.confirm.and.returnValue(q.reject());
        ds.views =jasmine.createSpyObj('obj', ['remove']);
        scope.removeView({});
        scope.$digest();
        expect(ds.views.remove).not.toHaveBeenCalled();
    });
    it("Удалить представление, ок", function () {
        modalService.confirm.and.returnValue(q.when());
        ds.views =jasmine.createSpyObj('obj', ['remove']);
        scope.removeView({});
        scope.$digest();
        expect(ds.views.remove).toHaveBeenCalled();
    });
});