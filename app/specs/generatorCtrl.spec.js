/**
 * Created by Станислав on 01.05.2016.
 */
describe('Тест generatorCtrl', function () {
    var controller, scope, modal, templateService, q;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        modal = jasmine.createSpyObj('modalService', ['addGenerator']);
        //Фейковый сервис
        templateService = jasmine.createSpyObj('templateService', ['getGenerateTemplateList']);

        //Получаем контроллер
        inject(function ($controller, $rootScope, $q) {
            q = $q;
            scope = $rootScope.$new();
            templateService.getGenerateTemplateList.and.returnValue(q.when({data: []}));
            controller = $controller('generatorCtrl', {
                $scope: scope,
                modalService: modal,
                templateService: templateService
            });
        });

    });
    it("Вход - вызов сервиса", function () {
        scope.$digest();
        expect(templateService.getGenerateTemplateList).toHaveBeenCalled();
    });
    it("Отмена добавления - вызов сервиса только один раз", function () {
        modal.addGenerator = function () {
            return q.reject('Ошибка');
        };
        scope.addGenerator();
        scope.$digest();
        expect(templateService.getGenerateTemplateList.calls.count()).toEqual(1);
    });
    it("Успешное добавление - вызов сервиса два раза", function () {
        modal.addGenerator = function () {
            return q.when();
        };
        scope.addGenerator();
        scope.$digest();
        expect(scope.model.error).toBeFalsy();
        expect(templateService.getGenerateTemplateList.calls.count()).toEqual(2);
    });
});