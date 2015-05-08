describe('Тест Entity', function () {
    var entity, coll = {entities: []};
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        entity = new Entity(coll);
    });
    it("Инициализация", function () {
        expect(entity.name).toBe('entity');
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
    it("Проверяем что создается уникальый номер", function () {
        var field = entity.addField();
        expect(field.name).toBe('field0');
        field = entity.addField();
        expect(field.name).toBe('field1');
    });
});