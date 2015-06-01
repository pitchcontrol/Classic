describe('Тест Entity', function () {
    var entity, coll = {entities: []}, counter, dS;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        inject(function (diagramService, integerCounter) {
            counter = integerCounter;
            dS = diagramService;
            entity = diagramService.addEntity();
        });
    });
    it("Инициализация", function () {
        expect(entity.name).toBe('Entity0');
        expect(entity.error).toBeUndefined();
    });
    it("Пытаемся продублировать имя", function () {
        coll.entities.push(new Entity(coll));
        var ent = new Entity(coll);
        ent.name = 'Entity2';
        coll.entities.push(ent);
        expect(ent.error).toBeUndefined();
        ent.name = 'entity';
        expect(ent.error).toBe('entity, уже есть');
        expect(ent.name).toBe('Entity2');
    });
    it("Создаем поле", function () {
        var field = entity.addField();
        expect(field instanceof Field).toBeTruthy();
        expect(field.entity).toBe(entity);

    });
    it("Создаем поле, на основе другого", function () {
        var f = {
            isRequired: true,
            name: "templateField",
            type: "bool"
        };
        var field = entity.addField(f);
        expect(field.name).toBe(f.name);
        expect(field.isRequired).toBe(f.isRequired);
        expect(field.type).toBe(f.type);
    });
    it("Проверяем что создается уникальый номер", function () {
        counter.clear();
        var field = entity.addField();
        expect(field.name).toBe('field0');
        field = entity.addField();
        expect(field.name).toBe('field1');
    });
    it("Удаляем сущность, вызывая destroy. Должны удалится связи", function () {
        var entity2 = dS.addEntity();
        var field = entity.addField();
        field.type = 'Association';
        field.association = entity2;
        //Должна появится связь
        expect(dS.associations.length).toBe(1);
        entity.destroy();
        expect(dS.associations.length).toBe(0);
    });
    it("Получаем JSON", function () {
        var entity2 = dS.addEntity();
        var field = entity.addField();
        field.type = 'Association';
        field.association = entity2;
        var json = entity.getJSON();
        expect(json.name).toBe(entity.name);
        expect(json.fields.length).toBe(entity.fields.length);
    });
});