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