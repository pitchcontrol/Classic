describe('Тест entityModalCtrl', function () {
    var controller, scope, modalInstance, entities = {}, diagramService, myEntity1, myEntity2;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        myEntity1 = {
            name: "myEntity1",
            fields: []
        };
        myEntity2 = {
            name: "myEntity2",
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
            controller = $controller('entityModalCtrl', {
                $scope: scope,
                entities: entities,
                item: item,
                $modalInstance: modalInstance
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
        expect(scope.model.name).toBe('Entity0');
        //Окрываем диалог создания снова
        CreateInstance(null);
        scope.ok();
        expect(scope.model.name).toBe('Entity1');
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
        scope.addField();
        expect(scope.model.fields.length).toBe(1);
    });
    it("ДОбавляем поле с разными именами", function () {
        scope.addField();
        scope.addField();
        scope.ok();
        expect(scope.model.fields.length).toBe(2);
        expect(scope.model.fields[0].name).toBe('field0');
        expect(scope.model.fields[1].name).toBe('field1');
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
        scope.model.addField();
        var f = scope.model.addField();
        //Выставляем повторяющееся поле
        scope.model.fields[1].name = 'field0';
        scope.ok();
        //Должна быть ошибка
        expect(scope.model.error).toBe('field0, уже есть');
        //Поля не поменяются
        expect(scope.model.fields[1].name).toBe('field1');
        expect(scope.model.fields[0].name).toBe('field0');
    });
    it("Переключаемся между полями", function () {
        var f1 = scope.model.addField();
        var f2 = scope.model.addField();
        f1.select();
        expect(scope.model.currentField).toBe(f1);
        expect(f1.select).toBeTruthy();
    });
});