describe('Тест addViewModalCtrl', function () {
    var controller, scope, ds, modalInstance, entity;
    beforeEach(function () {
        module('app');
    });
    function Init(view){
        //Получаем контроллер
        inject(function ($controller, $rootScope, diagramService) {
            ds = diagramService;
            entity = ds.addEntity();
            scope = $rootScope.$new();
            modalInstance = jasmine.createSpyObj('modalInstance', ['close']);
            controller = $controller('addViewModalCtrl', {
                $scope: scope,
                diagramService: ds,
                $modalInstance: modalInstance,
                data: view
            });
        });
    }
    beforeEach(function () {
        Init(null);
    });
    it("Тест повторяется представлени", function () {
        scope.model.name = "Главная";
        scope.ok();
        expect(scope.model.error).toBe('Уже есть такое представление');
    });
    it("Тест не выбранны сущности", function () {
        scope.model.name = "Пр";
        //Снимаем выделение
        scope.model.entities[0].included = false;
        scope.ok();
        expect(scope.model.error).toBe('Не выбранна ни одной сущности');
    });
    it("Не добавляем связанну сущность", function () {
        var entity2 = ds.addEntity();
        var field = entity.addField();
        field.association = entity2;
        scope.init();
        scope.model.name = "Пр";
        //Снимаем выделение
        scope.model.entities[1].included = false;
        scope.ok();
        expect(scope.model.error).toBe('Сущность ' + entity.name + ', связанна с Entity12 но она не добвленна.');
    });
    it("Все ок, добавляем вьюху", function () {
        scope.model.name = "Пр";
        scope.ok();
        //Одно представление есть всегда - главное
        expect(ds.views.collection.length).toBe(2);
        expect(ds.views.collection[1].entities.length).toBe(1);
        expect(ds.views.collection[1].entities[0]).toEqual(entity);
    });
    it("Проверяем режим редактирования, должу выставится не все сущности", function () {
        scope.model.name = "Пр";
        var entity2 = ds.addEntity();
        var entity3 = ds.addEntity();
        var view = {id: 1, name: "View1", entities: [entity3]};
        scope.init(view);
        //Добавляестя только одна сущность
        expect(scope.model.entities[2].included).toBeTruthy();
        expect(scope.model.entities[0].included).toBeFalsy();
        expect(scope.model.entities[1].included).toBeFalsy();
        //к модели дожно опменятся имя
        expect(scope.model.name).toBe('View1');
    });
    it("Редктируем вводим не валидное имя, ссылка не должна менятся", function () {
        var view = {id: 1, name: "View1", entities: [1]};
        scope.init(view);
        scope.model.name = "";
        scope.ok();
        expect(scope.model.error).toBe('Название не указанно');
        expect(view.name).toBe('View1');
    });
    it("Редктируем вводим валидное имя, ссылка должна менятся", function () {
        var view = {id: 1, name: "View1", entities: [entity]};
        Init(view);
        scope.model.name = "View2";
        scope.ok();
        expect(scope.model.error).toBeUndefined();
        expect(view.name).toBe('View2');
    });
    it("Редктируем не меняем имя не должно быть ошибки из-за повтора имени", function () {
        var view = {id: 1, name: "View1", entities: [entity]};
        ds.views.collection.push(view);
        Init(view);
        scope.ok();
        expect(scope.model.error).toBeUndefined();
    });
    it("Редктируем  меняем имя должна быть ошибки", function () {
        var view = {id: 1, name: "View1", entities: [entity.name]};
        var view2 = {id: 2, name: "View2", entities: [entity.name]};
        ds.views.collection.push(view);
        Init(view2);
        scope.model.name = "View1";
        scope.ok();
        expect(scope.model.error).toBeDefined();
    });
});