describe('Тест mainCtrl', function () {
    var controller, scope, modal, ds, q;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, diagramService, $q) {
            ds = diagramService;
            q = $q;
            scope = $rootScope.$new();
            modal = jasmine.createSpyObj('modal', ['open']);
            controller = $controller('mainCtrl', {
                $scope: scope,
                $modal: modal
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
});