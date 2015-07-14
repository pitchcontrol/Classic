describe('Тест integerCounter', function () {
    var counter;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        inject(function (integerCounter) {
            counter = integerCounter;
        });
    });

    it("Тест неповторяющихся значений", function () {
        counter.clear();
        expect(counter.getId()).toBe(0);
        expect(counter.getId()).toBe(1);
        expect(counter.getId()).toBe(2);
    });
    it("Получаем текущее значении", function () {
        counter.clear();
        counter.getId();
        expect(counter.getId()).toBe(1);
        expect(counter.getCurrent()).toBe(2);
    });
    it("Устанавливаем текущее значении", function () {
        counter.setCurrent(10);
        expect(counter.getId()).toBe(10);
        expect(counter.getCurrent()).toBe(11);
    });
});