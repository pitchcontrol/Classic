describe('Тест wizardCtrl', function () {
    var controller, scope, modalService, questions, promise;
    beforeEach(function () {
        module('app');
        questions = readJSON('test/questionList.json');
    });
    function Init(questions){
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            modalService = jasmine.createSpyObj('modalService', ['close', 'dismiss']);
            promise = jasmine.createSpyObj('promise', ['getQuestionList']);
            promise.getQuestionList.and.returnValue({data: questions});
            controller = $controller('wizardCtrl', {
                $scope: scope,
                $modalInstance: modalService,
                promise: promise.getQuestionList(),
                data: {
                    title: 'Выбор',
                    message: 'Выберите шаблон для генерации'
                }
            });
        });
        scope.$digest();
    };
    beforeEach(function () {
        //Получаем контроллер
        Init(questions);
    });
    it("Загружаем диалог, должна встать на первый вопрос", function () {
        expect(scope.model).toEqual(questions[0]);
    });
    it("Нажимаем далее - переход к следущему вопросу", function () {
        scope.next();
        expect(scope.model).toEqual(questions[1]);
    });
    it("Нажимаем назад в начале - перход невозможен", function () {
        scope.prev();
        expect(scope.model).toEqual(questions[0]);
    });
    it("Нажимаем назад в не начале - перход возможен", function () {
        scope.next();
        scope.prev();
        expect(scope.model).toEqual(questions[0]);
    });
    it("Нажимаем далее - на последнем пункте, выход ок", function () {
        scope.next();
        scope.next();
        scope.next();
        expect(modalService.close).toHaveBeenCalled();
    });
    it("Проверяем установку умолчаний", function () {
        scope.next();
        scope.next();
        //Тут должно быть умолчание
        expect(scope.model.answer).toBe(questions[2].default);
    });
    it("Вопросов нет выход", function () {
        Init([]);
        scope.next();
        expect(modalService.close).toHaveBeenCalled();
    });
    it('Ответа нет - переход не возможен', function () {
        expect(scope.hasNext()).toBeFalsy();
    });
    it('Ответ есть - переход возможен', function () {
        scope.model.answer = 'My namespace';
        expect(scope.hasNext()).toBeTruthy();
    });
    it('Вопрос булевский, ответа нет - переход возможен', function () {
        scope.next();
        expect(scope.hasNext()).toBeTruthy();
    });
});