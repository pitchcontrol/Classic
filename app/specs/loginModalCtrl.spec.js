describe('Тест loginModalCtrl', function () {
    var controller, scope, modal,authService;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        modal = jasmine.createSpyObj('modal', ['dismiss', 'close']);
        //Фейковый сервис
        authService = jasmine.createSpyObj('authService', ['login']);
        //Получаем контроллер
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller('loginModalCtrl', {
                $scope: scope,
                $modalInstance: modal,
                authService: authService
            });
        });
    });
    it("Закрытие окна - отмена", function () {
        scope.cancel();
        expect(modal.dismiss).toHaveBeenCalled();
    });
    it("Логин ошибка", function () {
        scope.ok();
    });
});