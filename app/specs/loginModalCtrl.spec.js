describe('Тест loginModalCtrl', function () {
    var controller, scope, modal, authService, q;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        modal = jasmine.createSpyObj('modal', ['dismiss', 'close']);
        //Фейковый сервис
        authService = jasmine.createSpyObj('authService', ['login']);
        //Получаем контроллер
        inject(function ($controller, $rootScope, $q) {
            q = $q;
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
        scope.model.login = "Vasya";
        scope.model.password = "12345";
        authService.login = function () {
            return q.reject('Ошибка');
        };
        scope.ok();
        scope.$digest();
        expect(scope.model.error).toBe('Ошибка');
    });
    it("Логин успех", function () {
        scope.model.login = "Vasya";
        scope.model.password = "12345";
        authService.login = function () {
            return q.when();
        };
        scope.ok();
        scope.$digest();
        expect(scope.model.error).toBeFalsy();
        expect(modal.close).toHaveBeenCalled();
    });
});