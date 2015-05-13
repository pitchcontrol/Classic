describe('Тест entityDraggable', function () {
    var compile, scope, document;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем службу для компиляци
        inject(function ($compile, $rootScope, $document) {
            document = $document;
            compile = $compile;
            scope = $rootScope.$new();
            scope.entities =[{}];
        });
    });
    function compiler() {
        var d = compile("<div entity-draggable entity='entities[0]'></div>")(scope);
        scope.$digest();
        return d;
    }

    it("Инициализация", function () {
        var elem = compiler()[0];
        expect(elem.style.cursor).toBe('pointer');
        expect(elem.style.position).toBe('absolute');
    });
    it("Должны установится геометрические параметры", function () {
        var elem = compiler()[0];
        expect(scope.entities[0].geometry.x).toBeDefined();
        expect(scope.entities[0].geometry.y).toBeDefined();
    });
    function moveElement(elem){
        var mousedown = new MouseEvent("mousedown", {bubbles: true, cancelable: true});

        var mousemove = new MouseEvent("mousemove", {bubbles: true, cancelable: true, clientX: 20, clientY: 20});

        var mouseup = new Event("mouseup", {bubbles: true, cancelable: true});

        //Нажали кнопку мыши
        elem.dispatchEvent(mousedown);
        document[0].dispatchEvent(mousemove);
        document[0].dispatchEvent(mouseup);
    }
    it("Перемещаем обьект", function () {
        var elem = compiler()[0];

        //Запоминаем кординаты
        var top = +elem.style.top.replace(/px/, '');
        var left = +elem.style.left.replace(/px/, '');

        moveElement(elem);
        expect(elem.style.top).toBe(20 + top + 'px');
        expect(elem.style.left).toBe(20 + left + 'px');
    });
    it("Перемещаем обьект, меняются свойства у сущности", function () {
        var elem = compiler()[0];
        moveElement(elem);
        expect(elem.style.top).toBe(scope.entities[0].geometry.y + 'px');
        expect(elem.style.left).toBe(scope.entities[0].geometry.x+ 'px');

    });
});