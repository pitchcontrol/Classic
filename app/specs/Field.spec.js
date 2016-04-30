describe('Тест Field', function () {
    var field, entity, entity2;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        entity = new Entity({associations: []});
        //    name: "myEntity1",
        //    fields: [],
        //    diagramService: {associations: []}
        //};
        entity.name = "myEntity1";
        field = new Field(entity);
        entity.fields.push(field);
        entity2 = {name: 'myEntity2', outerAssociation: []};
    });
    it("Инициализация", function () {
        expect(field.name).toBe('new');
        expect(field.type).toBe('string');
        expect(field.isRequired).toBeTruthy();
        expect(field.entity.diagramService.associations).toBeDefined();
    });
    it('Пустое поле имя, ошибка', function () {
        entity.fields.push(new Field(entity));
        var ent = new Field(entity);
        ent.name = "";
        entity.fields.push(ent);
        expect(entity.error).toBe('Имя обязательно');
        expect(ent.errors.name.required).toBeDefined();
        //Вводим не пустое ощибки нет
        ent.name = "Name";
        expect(entity.error).toBeUndefined();
        expect(ent.errors.name.required).toBeUndefined();
    });
    it("Дублируем одинаковые поля", function () {
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
        expect(ent.errors.name.dublicateName).toBeDefined();
    });
    it("Успешно меняем поля", function () {
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
        expect(ent.errorField).toBeUndefined();
    });
    it("Меняем тип на ассоциацию - должны получить ошибку", function () {
        field.type = "Association";
        expect(entity.error).toBe('выбран тип ассоциация но связь не заданна.');
        expect(field.errors.association.notSet).toBeDefined();
    });
    it("Выставляем ассоцию - не должно быть ошибку", function () {
        field.type = "Association";
        //Меняем тип на другой
        field.type = "string";
        expect(entity.error).toBeFalsy();
        expect(field.errorField).toBeUndefined();
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
        expect(json.isPrimaryKey).toBeUndefined();
        expect(json.associationObj.start.name).toBe(field.associationObj.start.name);
    });
    it("Проверяем JSON С первичным ключом", function () {
        field.isPrimaryKey = true;
        var json = field.getJSON();
        expect(json.isPrimaryKey).toBeTruthy();
    });
    it("Проверяем JSON С enum", function () {
        field.type = 'enum';
        field.enum = {name: "Enum1"};
        var json = field.getJSON();
        expect(json.enum).toBe('Enum1');
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
    it("Меняем тип поля должна уничтожится ссылка на enum", function () {
        field.type = "enum";
        field.enum = {};
        expect(field.enum).toBeTruthy();
        field.type = "string";
        //Должна разрущится связь
        expect(field.enum).toBeFalsy();
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
    it("Тип enum должна быть ошибка", function () {
        field.type = 'enum';
        expect(entity.error).toBe('выбран тип enum но значение незаданно');
        expect(field.errors.enum.notSet).toBeDefined();
    });
    it("Тип enum и задаем его, ок", function () {
        field.type = 'enum';
        expect(entity.error).toBe('выбран тип enum но значение незаданно');
        field.enum = {};
        expect(entity.error).toBeFalsy();
        expect(field.errors.enum.notSet).toBeUndefined();
    });
});