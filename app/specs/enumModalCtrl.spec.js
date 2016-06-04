describe('Тест enumModalCtrl', function () {
    var scope, ds, modal, controller;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, diagramService) {
            controller = $controller;
            scope = $rootScope.$new();
            ds = diagramService;
        });
        modal = jasmine.createSpyObj('modal', ['dismiss', 'close']);
    });
    function Init(data) {
        return  controller('enumModalCtrl', {
            $scope: scope,
            diagramService: ds,
            data: data,
            $uibModalInstance: modal
        });
    }

    it("Добавляем повторяющийся енум, должна быть ошибка", function () {
        var controller = Init(null);
        ds.enums.addItem({name: 'myName'});
        scope.model.name = 'myName';
        scope.ok();
        expect(modal.close).not.toHaveBeenCalled();
        expect(scope.model.error).toBe("Уже есть такое перечисление");
    });
    it("Добавляем не повторяющийся енум", function () {
        var controller = Init(null);
        scope.model.name = 'myName';
        scope.ok();
        expect(modal.close).toHaveBeenCalled();
        expect(ds.enums.collection.length).toBe(1);
        expect(scope.model.error).toBeUndefined();
    });
    it("Редактируем повторяется название", function () {
        var en1 = ds.enums.addItem({name: 'myName'});
        var en2 = ds.enums.addItem({name: 'myName2'});
        var controller = Init(en2);
        scope.model.name = 'myName';
        scope.ok();
        expect(modal.close).not.toHaveBeenCalled();
        expect(scope.model.error).toBe("myName, уже есть");
    });
    it("Редактируем не повторяется название", function () {
        var en1 = ds.enums.addItem({name: 'myName'});
        var en2 = ds.enums.addItem({name: 'myName2'});
        var controller = Init(en2);
        scope.model.name = 'myName3';
        scope.ok();
        expect(modal.close).toHaveBeenCalled();
        expect(scope.model.error).toBeFalsy();
    });
});