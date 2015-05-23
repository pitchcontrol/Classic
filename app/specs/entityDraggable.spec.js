describe('Тест entityDraggable', function () {
    var compile, scope, document, rootScope, ds;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем службу для компиляци
        inject(function ($compile, $rootScope, $document, diagramService) {
            ds = diagramService;
            document = $document;
            compile = $compile;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            scope.entities = [{id: 0, fields: [{id: 1}], outerAssociation: [{relation: new Relation()}]}];
        });
        ds.geometry.canvas = {};
        ds.geometry.canvas.width = 1500;
        ds.geometry.canvas.height = 1500;
        spyOn(rootScope, "$broadcast");
    });
    function compiler() {
        var d = compile("<div entity-draggable entity='entities[0]'></div>")(scope);
        scope.$digest();
        return d;
    }

    function compilerFull() {
        //var d = compile('<div entity-draggable entity="entities[0]"><ul><li ng-repeat="f in entities[0].fields">{{f.name}}</li></ul></div>')(scope);
        //Для того чтобы появились размеры нужно добавить в body иначе геометрия не расчитывается
        var element = angular.element('<div entity-draggable entity="entities[0]"><ul><li ng-repeat="f in entities[0].fields">{{f.name}}</li></ul></div>');
        angular.element(document).find('body').append(element);
        var d = compile(element)(scope);
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
        expect(scope.entities[0].geometry.height).toBeDefined();
        expect(scope.entities[0].geometry.width).toBeDefined();
        expect(scope.entities[0].geometry.bottom.x).toBeDefined();
        expect(scope.entities[0].geometry.bottom.y).toBeDefined();
    });
    function moveElement(elem, x, y) {
        var mousedown = new MouseEvent("mousedown", {bubbles: true, cancelable: true});

        var mousemove = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            clientX: x || 20,
            clientY: y || 20
        });

        var mouseup = new Event("mouseup", {bubbles: true, cancelable: true});

        //Нажали кнопку мыши
        elem.dispatchEvent(mousedown);
        document[0].dispatchEvent(mousemove);
        document[0].dispatchEvent(mouseup);
    }

    function getPosition(elem) {
        var top = +elem.style.top.replace(/px/, '');
        var left = +elem.style.left.replace(/px/, '');
        return {x: top, y: left};
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
        expect(elem.style.top).toBe(scope.entities[0].geometry.y + 20+ 'px');
        expect(elem.style.left).toBe(scope.entities[0].geometry.x + 'px');

    });
    it("Перемещаем обьект появлятся событие премещения сущности", function () {
        var elem = compiler()[0];
        moveElement(elem);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(scope.entities[0].id);
    });
    it("Перемещаем обьект появляется события премещения полей", function () {
        var elem = compiler()[0];
        moveElement(elem);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(scope.entities[0].fields[0].id);
    });
    it("Перемещаем обьект меняется нижний край", function () {
        var elem = compiler()[0];
        var x = scope.entities[0].geometry.bottom.x;
        var y = scope.entities[0].geometry.bottom.y;
        moveElement(elem);
        expect(scope.entities[0].geometry.bottom.x).toBe(x + 20);
        expect(scope.entities[0].geometry.bottom.y).toBe(y + 20);
    });
    it("Перемещаем обьект меняются положение связей", function () {
        var elem = compiler()[0];
        moveElement(elem);
        var x = scope.entities[0].geometry.bottom.x;
        var y = scope.entities[0].geometry.bottom.y;
        //Точка окончания не заданна тогда end (0,0)
        var center = (0 + x) / 2;

        expect(scope.entities[0].outerAssociation[0].relation.toString()).toBe('0,0 ' + center + ',0 ' + center + ',' + (y + 20) + ' ' + x + ',' + (y + 20) + ' ' + x + ',' + y);
    });
    it("Добавляем поле, меняется размер", function () {
        var d = compilerFull();
        var st = scope.entities[0].geometry.height;
        scope.entities[0].fields.push({name: "1234"});
        scope.$digest();
        var end = scope.entities[0].geometry.height;
        expect(end > st).toBeTruthy();
    });
    it("Ограничение сверху", function () {
        var elem = compiler()[0];
        var ps = getPosition(elem);
        moveElement(elem, 20, -3000);
        expect(elem.style.top).toBe('0px');
    });
    it("Ограничение снизу", function () {
        var elem = compiler()[0];
        var ps = getPosition(elem);
        moveElement(elem, 30, 3000);
        expect(elem.style.top).toBe('1500px');
    });
    it("Ограничение справа", function () {
        var elem = compiler()[0];
        var ps = getPosition(elem);
        moveElement(elem, 3000, 30);
        expect(elem.style.left).toBe('1500px');
    });
    it("Ограничение слева", function () {
        var elem = compiler()[0];
        var ps = getPosition(elem);
        moveElement(elem, -3000, 30);
        expect(elem.style.left).toBe('0px');
    });
});