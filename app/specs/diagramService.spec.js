describe('Тест diagramService', function () {
    var ds, scope;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function (diagramService, $rootScope) {
            scope = $rootScope.$new();
            ds = diagramService;
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
});