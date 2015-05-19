describe('Тест fieldDraggable', function () {
    var compile, scope, rootScope;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем службу для компиляци
        inject(function ($compile, $rootScope) {
            compile = $compile;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.myField = {name: 'myField', id: 0, entity: {id: 1, geometry: {x: 0, y: 0}}};
        });
    });
    function comp() {
        var element = angular.element('<div field-draggable field="myField"></div>');
        angular.element(document).find('body').append(element);
        var d = compile(element)(scope);
        scope.$digest();
        return d;
    }

    it("Тест получения координат", function () {
        var elem = comp()[0];
        expect(scope.myField.geometry.x).toBeDefined();
        expect(scope.myField.geometry.y).toBeDefined();
        expect(scope.myField.geometry.right.x).toBeDefined();
        expect(scope.myField.geometry.right.y).toBeDefined();
    });
    it("Вызываем событи движения сущности, дожны пересчитыватся размеры", function () {
        var elem = comp()[0];
        //Сбросим координаты чтобы видно было что положение меняется
        scope.myField.geometry.x = 0;
        scope.myField.geometry.y = 0;
        rootScope.$broadcast(scope.myField.entity.id);
        expect(scope.myField.geometry.x).not.toBe(0);
        expect(scope.myField.geometry.y).not.toBe(0);
    });
    it("Вызываем событи движения сущности, должны вызыватся события перемещения поля", function () {
        var elem = comp()[0];
        var listener = jasmine.createSpy('listener');
        scope.$on(scope.myField.id, listener);
        rootScope.$broadcast(1);
        expect(listener).toHaveBeenCalled();
    });
    it("Вызываем событи движения сущности, должны обойтись Relation в полях", function () {
        var elem = comp()[0];
        scope.myField.associationObj = {relation: jasmine.createSpyObj('relation', ['setEnd'])};
        rootScope.$broadcast(1);
        expect(scope.myField.associationObj.relation.setEnd).toHaveBeenCalled();
    });
});