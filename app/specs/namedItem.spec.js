describe('Тест namedItem', function () {
    var item, obj, counter, collection, nc, ncInstance;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        inject(function (namedItem, integerCounter, namedCollection) {
            item = namedItem;
            counter = integerCounter;
            nc = namedCollection;
        });
        obj = function (collection, counter) {
            item.apply(this, [collection, counter, 'Item']);
        };
        obj.prototype = Object.create(item.prototype);
        ncInstance = new nc(obj, counter);
    });
    it("Тестируем создание обьекта", function () {
        var instance = ncInstance.addItem();
        expect(instance.id).toBeDefined();
        expect(instance.name).toContain('Item');
    });
    it("Устанавливаем повторяющиеся имя", function () {
        var instance1 = ncInstance.addItem();
        var instance2 = ncInstance.addItem();
        var oldName = instance2.name;
        instance2.name = instance1.name;
        expect(instance2.error).toContain('уже есть');
        expect(instance2.name).toBe(oldName);
    });
    it("Устанавливаем не повторяющиеся имя", function () {
        var instance1 = ncInstance.addItem();
        var instance2 = ncInstance.addItem();
        var oldName = instance2.name;
        instance2.name = 'new name';
        expect(instance2.error).toBeFalsy();
        expect(instance2.name).toBe('new name');
    });
});