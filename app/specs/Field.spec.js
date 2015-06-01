describe('Тест Field', function () {
    var field, entity, entity2;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        entity = {
            name: "myEntity1",
            fields: [],
            diagramService: {associations: []}
        };
        field = new Field(entity);
        entity2 = {name: 'myEntity2', outerAssociation: []};
    });
    it("Инициализация", function () {
        expect(field.name).toBe('new');
        expect(field.type).toBe('string');
        expect(field.isRequired).toBeTruthy();
        expect(field.entity.diagramService.associations).toBeDefined();
    });
    it("Дублируем одинаковые поля", function () {
        entity.fields.push(new Field(entity));
        var ent = new Field(entity);
        ent.name = "field1";
        entity.fields.push(ent);
        expect(entity.fields[0].name).toBe('new');
        expect(entity.fields[1].name).toBe('field1');
        expect(entity.error).toBeFalsy();
        //Пытаемся поменять поле
        ent.name = 'new';
        expect(entity.fields[1].name).toBe('field1');
        expect(entity.error).toBe('new, уже есть');
    });
    it("Успешно меняем поля", function () {
        entity.fields.push(new Field(entity));
        var ent = new Field(entity);
        ent.name = "field1";
        entity.fields.push(ent);
        expect(entity.fields[0].name).toBe('new');
        expect(entity.fields[1].name).toBe('field1');
        expect(entity.error).toBeFalsy();
        //Пытаемся поменять поле
        ent.name = 'field2';
        expect(entity.fields[1].name).toBe('field2');
        expect(entity.error).toBeFalsy();
    });
    it("Меняем тип на ассоциацию - должны получить ошибку", function () {
        field.type = "Association";
        expect(entity.error).toBe('выбран тип ассоциация но связь не заданна.');
    });
    it("Выставляем ассоцию - не должно быть ошибку", function () {
        field.type = "Association";
        //Меняем тип на другой
        field.type = "string";
        expect(entity.error).toBeFalsy();
    });
    it("Выставляем связь", function () {
        field.type = "Association";
        field.association = entity2;
        //Должен появится обьект связь
        expect(field.associationObj.start).toBeDefined();
        expect(field.associationObj.end).toBeDefined();
        expect(field.associationObj.toString()).toBe('myEntity1_new_myEntity2');
        //Должна появится внешняя ассоциация
        expect(entity2.outerAssociation.length).toBe(1);
        expect(entity2.outerAssociation[0] == field.associationObj).toBeTruthy();
    });
    it("ВЫставляем связь проверяем JSON", function () {
        field.type = "Association";
        field.association = entity2;
        var json = field.getJSON();
        expect(json.name).toBe(field.name);
        expect(json.type).toBe(field.type);
        expect(json.isRequired).toBe(field.isRequired);
        expect(json.associationObj.start.name).toBe(field.associationObj.start.name);
    });
    it("Меняем тип поля должна уничтожится связь", function () {
        field.type = "Association";
        field.association = entity2;
        //Должен появится обьект связь
        expect(field.entity.diagramService.associations.length).toBe(1);
        //Должна появится внешняя ассоциация
        expect(entity2.outerAssociation.length).toBe(1);
        field.type = "string";
        //Должна разрущится связь
        expect(field.association).toBeFalsy();
        expect(field.entity.diagramService.associations.length).toBe(0);
        //Уничтожается внешняя связь
        expect(entity2.outerAssociation.length).toBe(0);
    });
    it("Меняем ссылку в колекции ассоциаций не должно добавится", function () {
        field.type = "Association";
        field.association = entity2;
        //Должен появится обьект связь
        expect(field.entity.diagramService.associations.length).toBe(1);
        //Должна появится внешняя ассоциация
        expect(entity2.outerAssociation.length).toBe(1);
        //Меняем ссылку
        field.association = {name: 'myEntity3', outerAssociation: []};
        expect(field.entity.diagramService.associations.length).toBe(1);
        //Уничтожается внешняя связь
        expect(entity2.outerAssociation.length).toBe(0);
    });
});