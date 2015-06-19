describe('Тест wizardCtrl', function () {
    var controller, scope, modalService, questions, promise;
    beforeEach(function () {
        module('app');
        questions = readJSON('test/questionList.json');
    });
    beforeEach(function () {
        //Получаем контроллер
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
});