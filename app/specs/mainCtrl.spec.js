describe('Тест mainCtrl', function () {
    var controller, scope, modal;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            modal = jasmine.createSpyObj('modal', ['open']);
            controller = $controller('mainCtrl', {
                $scope: scope,
                $modal: modal
            });
        });
    });
    it("Добавление новой сущности", function () {
        scope.addEntity();
        expect(modal.open).toHaveBeenCalled();
    });
    it("Редактирование сущности", function () {
        scope.editEntity({});
        expect(modal.open).toHaveBeenCalled()
    });
});