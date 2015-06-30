/**
 * Created by snekrasov on 13.05.2015.
 */
describe('Тест обьекта связь', function () {
    var relation;
    beforeEach(function () {
        relation = new Relation();
    });
    it("Задаем координаты", function () {
        relation.setStart(120, 120);
        relation.setEnd(20, 100);
        expect(relation.toString()).toBe('20,100 70,100 70,140 120,140 120,120');
    });
    it("Меняем начало", function () {
        relation.setStart(20, 20);
        relation.setEnd(20, 100);
        relation.setStart(120, 120);
        expect(relation.toString()).toBe('20,100 70,100 70,140 120,140 120,120');
    });
    it("Меняем конец", function () {
        relation.setStart(120, 120);
        relation.setEnd(20, 80);
        relation.setEnd(20, 100);
        expect(relation.toString()).toBe('20,100 70,100 70,140 120,140 120,120');
    });
    it("Меняем конец, причем родитель выще", function () {
        relation.setStart(60, 60);
        relation.setEnd(40, 60);
        relation.setEnd(40, 100);
        expect(relation.toString()).toBe('40,100 50,100 50,100 60,100 60,60');
    });
    it("Меняем конец сначала родитель выше потом, ниже", function () {
        relation.setStart(60, 60);
        relation.setEnd(40, 100);
        relation.setEnd(40, 20);
        expect(relation.toString()).toBe('40,20 50,20 50,80 60,80 60,60');
    });
    it("Меняем начало, причем родитель выще", function () {
        relation.setEnd(40, 100);
        relation.setStart(60, 180);
        relation.setStart(60, 60);
        expect(relation.toString()).toBe('40,100 50,100 50,100 60,100 60,60');
    });
    it("Меняем конец причем родитель выше и левее", function () {
        relation.setStart(60, 60);
        relation.setEnd(40, 60);
        relation.setEnd(100, 100);
        expect(relation.toString()).toBe('100,100 120,100 120,80 60,80 60,60');
    });
    it("Меняем конец родитель ниже и левее", function () {
        relation.setStart(20, 120);
        relation.setEnd(40, 60);
        relation.setEnd(140, 20);
        expect(relation.toString()).toBe('140,20 160,20 160,140 20,140 20,120');
    });
});