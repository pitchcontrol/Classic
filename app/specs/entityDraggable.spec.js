describe('Тест entityDraggable', function () {
    var compile, scope, document, rootScope, ds, geomBlock;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем службу для компиляци
        inject(function ($compile, $rootScope, $document, diagramService, geometryBlock) {
            geomBlock = geometryBlock;
            ds = diagramService;
            document = $document;
            compile = $compile;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            diagramService.entities = [{id: 0, fields: [{id: 1}], outerAssociation: [{relation: new Relation()}]}];
            scope.entities = diagramService.entities;
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
        expect(elem.style.cursor).toBe('move');
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
    it("Загружаем сущность, должны установится координаты", function () {
        ds.entities[0].geometry = {x: 100, y: 150};
        var elem = compiler()[0];
        var pos = getPosition(elem);
        expect(pos.x).toBe(100);
        expect(pos.y).toBe(150);
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
        return {y: top, x: left};
    }

    it("Перемещаем обьект", function () {
        var elem = compiler()[0];

        //Запоминаем кординаты
        var top = +elem.style.top.replace(/px/, '');
        var left = +elem.style.left.replace(/px/, '');

        moveElement(elem);
        //Обе координаты смещаются на 20
        expect(elem.style.top).toBe(top + 20 + 'px');
        expect(elem.style.left).toBe(left + 20 + 'px');
    });
    it("Перемещаем обьект, меняются свойства у сущности", function () {
        var elem = compiler()[0];
        moveElement(elem);
        expect(elem.style.top).toBe(scope.entities[0].geometry.y + 'px');
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
        //Обе координаты смещаются на 20
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

    function overlapPrepare() {
        ds.entities.push({
            id: 1,
            fields: [{id: 1}]
        });
        var elem = compiler()[0];
        spyOn(scope.entities[0].outerAssociation[0].relation, 'setStart');

        scope.entities[1].geometry = new geomBlock(0, 0, 235, 40);
        //В тестах нужно явно задать размеры
        scope.entities[0].geometry.width = 235;
        scope.entities[0].geometry.heigh = 40;
        //задаем начальные координаты напрямую
        //Левый верхний угол в нижний правый сектор
        //Пусть наезд будет 200, 20
        var difX = -scope.entities[0].geometry.x + 200;
        var difY = -scope.entities[0].geometry.y + 20;
        moveElement(elem, difX, difY);
        return elem;
    }

    it("Проверка коррекции наезжания блоков", function () {
        var elem = overlapPrepare();
        expect(elem.style.left).toBe('255px');
        expect(elem.style.top).toBe('60px');
    });
    it("Проверка коррекции наезжания блоков, обновлени связей", function () {
        overlapPrepare();
        //Связи должны обновится
        expect(scope.entities[0].outerAssociation[0].relation.setStart.calls.argsFor(1)).toEqual([372.5, 60]);
    });
    it("Проверка коррекции наезжания блоков, События перемещения полей и сущностей", function () {
        overlapPrepare();
        //Должны появится события перемещения полей и сущностей
        expect(rootScope.$broadcast).toHaveBeenCalledWith(scope.entities[0].id);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(scope.entities[0].fields[0].id);
    });
});