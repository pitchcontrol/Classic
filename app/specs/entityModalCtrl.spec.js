describe('Тест entityModalCtrl', function () {
    var controller, scope, modalInstance, entities = {}, diagramService, myEntity1, myEntity2;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        myEntity1 = {
            name: "myEntity1",
            fields: [],
            outerAssociation: []
        };
        myEntity2 = {
            name: "myEntity2",
            outerAssociation: [],
            fields: [{
                entity: myEntity2,
                type: "Association",
                name: 'myField1',
                association: myEntity1
            }, {
                entity: myEntity2,
                type: "string",
                name: 'myField2'
            }]
        };
    });
    function CreateInstance(item) {
        //Получаем контроллер
        inject(function ($controller, $rootScope, $injector) {
            scope = $rootScope.$new();
            diagramService = $injector.get('diagramService');
            modalInstance = jasmine.createSpyObj('modalInstance', ['open', 'close', 'dismiss']);
            item = item || diagramService.addEntity();
            controller = $controller('entityModalCtrl', {
                $scope: scope,
                entities: entities,
                item: item,
                $uibModalInstance: modalInstance
            });
        });
    };
    beforeEach(function () {
        CreateInstance(null);
    });
    it("Успешное создание формы", function () {
        scope.model.name = "my";
        scope.ok();
        expect(modalInstance.close).toHaveBeenCalled();
        expect(diagramService.entities.length).toBe(1);
    });
    it("Новая сущность с новым названием", function () {
        scope.ok();
        var name1 = scope.model.name;
        //Окрываем диалог создания снова
        CreateInstance(null);
        scope.ok();
        var name2 = scope.model.name;
        expect(name1 != name2).toBeTruthy();
    });
    it("Редактируем сущность", function () {
        //beforeEach уже создал одну сущность
        //Открываем на редактирование сущность
        CreateInstance(diagramService.entities[0]);
        scope.ok();
        //Ни чего не поменяли все должно быть ок
        expect(!!scope.model.error).toBeFalsy();
        expect(modalInstance.close).toHaveBeenCalled();
        //Не должны добавлятся сущности
        expect(diagramService.entities.length).toBe(1);
    });
    it("Редактируем сущность, меняем ее емя", function () {
        //beforeEach уже создал одну сущность
        //Открываем не редактирование сущность
        CreateInstance(diagramService.entities[0]);
        scope.model.name = 'my2';
        scope.ok();
        expect(scope.model.error).toBeFalsy();
        expect(modalInstance.close).toHaveBeenCalled();
        //Не должны добавлятся сущности
        expect(diagramService.entities.length).toBe(1);
        //Должно поменятся имя
        expect(diagramService.entities[0].name).toBe('my2');
    });
    it("Редактируем сущность, проверяем создание копий", function () {
        //beforeEach уже создал одну сущность
        //Открываем на редактирование сущность
        var entity = diagramService.addEntity();
        entity.addField();
        entity.addField();
        CreateInstance(entity);
        scope.ok();
        expect(entity.fields.every(function (item) {
            return item.savedObject !== undefined;
        })).toBeTruthy();
    });
    it("Редактируем сущность, проверяем отмену изменений", function () {
        //beforeEach уже создал одну сущность
        //Открываем на редактирование сущность
        var entity = diagramService.addEntity();
        var field = entity.addField();
        field.name = "my name";
        field.type = "integer";
        entity.addField();
        CreateInstance(entity);
        field.name = "my super name";
        field.type = "string";
        expect(field.name).toBe('my super name');
        expect(field.type).toBe('string');
        scope.cancel();
        expect(field.name).toBe('my name');
        expect(field.type).toBe('integer');
    });
    it("Создаем сущность, проверяем отмену изменений", function () {
        CreateInstance();
        scope.cancel();
    });
    it("Создаем сущность, добавляем поле после сохранения флаг добавлен снимается", function () {
        var entity = diagramService.addEntity();
        var field = entity.addField();
        expect(field.added).toBeTruthy();

        CreateInstance(entity);
        scope.ok();
        expect(field.added).toBeUndefined();
    });
    it("Редактируем сущность, добавляем поле, отменяем, поле удаляется", function () {
        var entity = diagramService.addEntity();
        var field = entity.addField();
        expect(field.added).toBeTruthy();
        expect(entity.fields.length).toBe(1);
        CreateInstance(entity);
        scope.cancel();
        expect(entity.fields.length).toBe(0);
    });
    it("Устанавливаем тип Association, не указываем связь", function () {
        var f = scope.model.addField();
        f.type = "Association";
        expect(scope.model.error).toBe('выбран тип ассоциация но связь не заданна.');
        expect(modalInstance.close).not.toHaveBeenCalled();
    });
    it("Добавляем связь в поле, должна появится ассоция", function () {
        scope.ok();
        var f = scope.model.addField();
        scope.model.addField();
        f.type = "Association";
        f.association = myEntity1;
        expect(diagramService.associations.length).toBe(1);
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it("Добавляем поле", function () {
        scope.model.addField();
        expect(scope.model.fields.length).toBe(1);
    });
    it("ДОбавляем поле с разными именами", function () {
        scope.model.addField();
        scope.model.addField();
        scope.ok();
        expect(scope.model.fields.length).toBe(2);
        expect(scope.model.fields[0].name).toContain('field');
        expect(scope.model.fields[1].name).toContain('field');
        expect(scope.model.fields[0].name != scope.model.fields[1].name).toBeTruthy();
    });
    it("Удалить поле", function () {
        var f = scope.model.addField();
        expect(scope.model.fields.length).toBe(1);
        //Выбираем поле
        f.select();
        scope.model.removeField();
        expect(scope.model.fields.length).toBe(0);
    });
    it("Удаляем поле должна удалится связь", function () {
        //Добавляем связь
        scope.ok();
        var f = scope.model.addField();
        scope.model.addField();
        f.type = "Association";
        f.association = myEntity1;
        expect(diagramService.associations.length).toBe(1);
        //Выбираем поле
        f.select();
        //Удаляем поле
        scope.model.removeField();
        expect(diagramService.associations.length).toBe(0);
    });
    it("Создаем поля и пробуем отредактировать с повторяющимся именем", function () {
        //Добавляем поля
        var f1 = scope.model.addField();
        var f1Name = f1.name;
        var f = scope.model.addField();
        var f2Name = f.name;
        //Выставляем повторяющееся поле
        scope.model.fields[1].name = f1Name;
        scope.ok();
        //Должна быть ошибка
        expect(scope.model.error).toBe(f1Name + ', уже есть');
        //Поля не поменяются
        expect(scope.model.fields[1].name).toBe(f2Name);
        expect(scope.model.fields[0].name).toBe(f1Name);
    });
    it("Переключаемся между полями", function () {
        var f1 = scope.model.addField();
        var f2 = scope.model.addField();
        f1.select();
        expect(scope.model.currentField).toBe(f1);
        expect(f1.select).toBeTruthy();
    });
});