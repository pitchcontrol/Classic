describe('Тест diagramService', function () {
    var ds, scope, ic, timeout;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function (diagramService, $rootScope, integerCounter, $timeout) {
            scope = $rootScope.$new();
            ds = diagramService;
            ic = integerCounter;
            timeout = $timeout;
        });
    });
    it("Создаем на основе другой", function () {
        var json = readJSON('test/entityTemplates.json');
        var entity = ds.addEntity(json[0]);
        expect(entity.name).toBe(json[0].name);
        expect(entity.fields.length).toBe(json[0].fields.length);
    });
    it("Создаем на основе другой поля должны правильно выставится", function () {
        var json = readJSON('test/entityTemplates.json');
        var entity = ds.addEntity(json[0]);
        expect(entity.fields.length).toBe(json[0].fields.length);
        entity.fields.forEach(function (item, index) {
            expect(item.name).toBe(json[0].fields[index].name);
            expect(item.type).toBe(json[0].fields[index].type);
        });
    });
    it("Проверяем получения JSON", function () {
        var json = readJSON('test/entityTemplates.json');
        var entity = ds.addEntity(json[0]);
        ds.enums.addItem();
        var sj = ds.getJSON();
        expect(sj.entities.length).toBe(json.length);
        expect(sj.entities[0].name).toBe(json[0].name);
        expect(sj.enums.length).toBe(1);
    });
    it("Создаем на основе другой, дублируем имя", function () {
        var json = readJSON('test/entityTemplates.json');
        ds.addEntity(json[0]);
        ds.addEntity(json[0]);
        //Во втором случае должна добавится цифра к названию
        expect(ds.entities[0].name).toBe(json[0].name);
        expect(ds.entities[1].name).not.toBe(json[0].name);
        expect(ds.entities[1].name).toContain(json[0].name);
    });
    it("Очишаем проект", function () {
        var json = readJSON('test/entityTemplates.json');
        var entity1 = ds.addEntity(json[0]);
        var entity2 = ds.addEntity(json[0]);
        ds.projectName = "Super project";
        ds.projectId = -2;
        ds.views.addItem({name: "View1", entities: [entity1, entity2]});
        ds.enums.addItem({name: "Enum2"});
        ds.clear();
        expect(ds.projectName).toBeUndefined();
        expect(ds.projectId).toBeUndefined();
        expect(ds.entities.length).toBe(0);
        expect(ds.views.collection.length).toBe(1);
        expect(ds.enums.collection.length).toBe(0);

    });
    it("Получаем полную версию JSON, для сохранения", function () {
        var json = readJSON('test/entityTemplates.json');
        ds.addEntity(json[0]);
        ds.projectName = "Super project";
        var sj = ds.getJSON(true);
        //Проверяем колекцию сущностей
        expect(sj.entities.length).toBe(1);
        //Проверяем сохранение счетчика
        //expect(sj.currentCounter).toBe(ic.getCurrent());
        expect(sj.projectName).toBe("Super project");
        //главная всегда есть
        expect(sj.views.length).toBe(1);
    });
    it("Получение полную версию JSON, проверяем сохранение View", function () {
        var entity = ds.addEntity();
        ds.projectName = "Super project";
        ds.views.addItem({name: "View1", entities: [entity]});
        var sj = ds.getJSON(true);
        //главная всегда есть
        expect(sj.views.length).toBe(2);
        expect(sj.views[1].name).toBe('View1');
        expect(sj.views[1].entities[0]).toBe(entity.name);
    });
    it("Получение полную версию JSON, проверяем сохранение Enum", function () {
        ds.projectName = "Super project";
        ds.enums.addItem({name: "Enum1", values: ['value1', 'value2']});
        var sj = ds.getJSON(true);
        expect(sj.enums.length).toBe(1);
        expect(sj.enums[0].name).toBe('Enum1');
        expect(sj.enums[0].values[0]).toBe('value1');
        expect(sj.enums[0].values[1]).toBe('value2');
    });
    it("Загрузить сущность", function () {
        var json = readJSON('test/project.json')[0];
        ds.loadProject(json);
        scope.$digest();
        //Должно быть две сущности
        expect(ds.entities.length).toBe(2);
        //У каждой сущности по одному полю
        expect(ds.entities[0].fields.length).toBe(1);
        expect(ds.entities[1].fields.length).toBe(1);
        //Во второй сущности должна быть ассоциация
        expect(ds.entities[1].fields[0].type).toBe('Association');
        timeout.flush();
        //Появится ассоциация
        expect(ds.associations.length).toBe(1);
        //Колекция запланированных действия должна быть пуста
        expect(ds.shedule.length).toBe(0);
        //Проставятся view +1 главная всегда есть
        expect(ds.views.collection.length).toBe(2);
        //Колекция enum
        expect(ds.enums.collection.length).toBe(json.diagram.enums.length);
        expect(ds.enums.collection[0].name).toBe('Enum1');
        expect(ds.enums.collection[1].name).toBe('Enum2');
    });
    it("Поиск сущности по имени", function () {
        var entity1 = ds.addEntity();
        var entity2 = ds.addEntity();
        var entity3 = ds.addEntity();
        var fe = ds.findEntity(entity2.name);
        expect(entity2).toEqual(fe);
    });
    it("Удалить сущность удалятся из представлений", function () {
        var entity1 = ds.addEntity();
        var entity2 = ds.addEntity();
        ds.views.addItem({name: "Test", entities: [entity1, entity2]});
        expect(ds.views.collection.length).toBe(2);
        expect(ds.views.collection[1].entities[0].id).toBe(entity1.id);
        expect(ds.views.collection[1].entities[1].id).toBe(entity2.id);
        ds.removeEntity(entity1);
        //Остается только одна сущность в колекции
        expect(ds.views.collection[1].entities.length).toBe(1);
        expect(ds.views.collection[1].entities[0].id).toBe(entity2.id);
    });
    it("Удаляет представление, пробоем главное", function () {
        expect(ds.views.collection.length).toBe(1);
        ds.views.remove(ds.views);
        //Главная не кдаляется
        expect(ds.views.collection.length).toBe(1);
    });
    it("Удаляет представление, пользовательское", function () {
        ds.views.addItem({name: 'View', entities: []});
        expect(ds.views.collection.length).toBe(2);
        ds.views.remove(ds.views.collection[1]);
        //Главная не кдаляется
        expect(ds.views.collection.length).toBe(1);
    });
});
