describe('Тест namedCollection', function () {
    var ncollection, test;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем фабрику
        inject(function (namedCollection) {
            ncollection = namedCollection;
        });
        test = function (collection, idService) {
            this.collection = collection;
            this.idService = idService;
        };
        test.prototype.destroy = function () {
            this.called = true;
        }
    });
    it("Тест создание обьекта", function () {
        var idService = {};

        var cn = new ncollection(test, idService);
        var obj = cn.addItem();
        //Добавилось в колекцию
        expect(cn.collection.length).toBe(1);
        //В конструктор передались значения
        expect(obj.collection.collection).toEqual(cn.collection);
        expect(obj.idService).toEqual(idService);
    });
    it("Поиск по ид", function () {
        var cn = new ncollection();
        cn.collection.push({id: 0});
        cn.collection.push({id: 1});
        cn.collection.push({id: 2});
        var obj = cn.findById(1);
        expect(obj).toBeDefined();
    });
    it("Поиск по имени", function () {
        var cn = new ncollection();
        cn.collection.push({name: 'name0'});
        cn.collection.push({name: 'name1'});
        cn.collection.push({name: 'name2'});
        var obj = cn.findByName('name1');
        expect(obj).toBeDefined();
    });
    it("Удаляем сущность, проверяем вызов destroy", function () {
        var cn = new ncollection(test);
        var item = cn.addItem();
        cn.remove(item);
        expect(item.called).toBeTruthy();
        expect(cn.collection.length).toBe(0);
    });

    it("Добавление на основе обьекте", function () {
        var cn = new ncollection(test);
        var item = cn.addItem({name: 'myName', field: 'myField'});
        expect(item.name).toBe('myName');
        expect(item.field).toBe('myField');
    });
    it("Добавление на основе обьекте, причем имя повторяется", function () {
        var cn = new ncollection(test);
        cn.addItem({name: 'myName', field: 'myField'});
        expect(cn.collection.length).toBe(1);
        var result = cn.addItem({name: 'myName', field: 'myField'});
        expect(result).toBeFalsy();
        expect(cn.collection.length).toBe(1);
    });
    it("Удаляем сущность и вызываем калбак", function () {
        var cn = new ncollection(test);
        var item = cn.addItem({name: 'myName', field: 'myField'});
        cn.onRemove = function (collection, item) {
            return false;
        };
        cn.remove(item);
        expect(cn.collection.length).toBe(1);
        cn.onRemove = function (collection, item) {
            return true;
        };
        cn.remove(item);
        expect(cn.collection.length).toBe(0);
    });
    it("Очистка колекции", function () {
        var cn = new ncollection(test);
        var item1 = cn.addItem();
        var item2 = cn.addItem();
        expect(cn.collection.length).toBe(2);
        cn.clear();
        expect(cn.collection.length).toBe(0);
        //Вызванна функция destroy()
        expect(item1.called).toBeTruthy();
        expect(item2.called).toBeTruthy();
    });
});