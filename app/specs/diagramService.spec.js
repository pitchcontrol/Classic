describe('Тест diagramService', function () {
    var ds, scope, ic;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function (diagramService, $rootScope,integerCounter) {
            scope = $rootScope.$new();
            ds = diagramService;
            ic = integerCounter;
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
        var sj = ds.getJSON();
        expect(sj.length).toBe(json.length);
        expect(sj[0].name).toBe(json[0].name);
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
    });
    it("Загрузить сущность", function () {
        var json = readJSON('test/project.json')[0];
        ds.loadProject(json);
        //Должно быть две сущности
        expect(ds.entities.length).toBe(2);
        //У каждой сущности по одному полю
        expect(ds.entities[0].fields.length).toBe(1);
        expect(ds.entities[1].fields.length).toBe(1);
        //Во второй сущности должна быть ассоциация
        expect(ds.entities[1].fields[0].type).toBe('Association');
        //Появится ассоциация
        expect(ds.associations.length).toBe(1);
    });
    it("Поиск сущности по имени", function () {
        var entity1 = ds.addEntity();
        var entity2 = ds.addEntity();
        var entity3 = ds.addEntity();
        var fe = ds.findEntity(entity2.name);
        expect(entity2).toEqual(fe);
    });
});