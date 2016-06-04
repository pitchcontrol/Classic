describe('Тест selectModalCtrl', function () {
    var controller, scope, modal, templateService, q;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function ($controller, $rootScope, $q) {
            modal = jasmine.createSpyObj('modal', ['dismiss', 'close']);
            items = [];
            modalService = jasmine.createSpyObj('templateService', ['getEntityTemplateList']);
            modalService.getEntityTemplateList.and.returnValue($q.when(items));
            scope = $rootScope.$new();
            controller = $controller('selectModalCtrl', {
                $scope: scope,
                $uibModalInstance: modal,
                promise: modalService.getEntityTemplateList,
                data: {}
            });
        });
        scope.$digest();

    });
    it("Закрытие окна - отмена", function () {
        scope.cancel();
        expect(modal.dismiss).toHaveBeenCalled();
    });
    it("Закрытие окна - ок", function () {
        scope.selectedItem = {};
        scope.ok();
        expect(modal.close).toHaveBeenCalledWith(scope.selectedItem);
    });
});