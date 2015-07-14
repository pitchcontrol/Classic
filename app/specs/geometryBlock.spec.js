describe('Тест geometryBlock', function () {
    var block, secondBlock;
    beforeEach(function () {
        module('app');
    });
    beforeEach(function () {
        //Получаем контроллер
        inject(function (geometryBlock) {
            secondBlock = geometryBlock;
            block = new geometryBlock(10, 10, 100, 100);
        });
    });
    it("Тест консруктора", function () {
        expect(block.x).toBe(10);
        expect(block.y).toBe(10);
        expect(block.width).toBe(100);
        expect(block.height).toBe(100);
        expect(block.bottom.x).toBe(60);
        expect(block.bottom.y).toBe(110);
        expect(block.right.y).toBe(60);
        expect(block.right.x).toBe(110);
        expect(block.topRight.x).toBe(110);
        expect(block.topRight.y).toBe(10);
        expect(block.bottomLeft.x).toBe(10);
        expect(block.bottomLeft.y).toBe(110);
        expect(block.bottomRight.x).toBe(110);
        expect(block.bottomRight.y).toBe(110);
    });
    it("Меняем координаты x", function () {
        block.x = 20;
        expect(block.bottom.x).toBe(70);
        expect(block.bottom.y).toBe(110);
        expect(block.right.y).toBe(60);
        expect(block.right.x).toBe(120);
        expect(block.topRight.x).toBe(120);
        expect(block.topRight.y).toBe(10);
        expect(block.bottomLeft.x).toBe(20);
        expect(block.bottomLeft.y).toBe(110);
        expect(block.bottomRight.x).toBe(120);
        expect(block.bottomRight.y).toBe(110);
    });
    it("Меняем координаты y", function () {
        block.y = 20;
        expect(block.bottom.x).toBe(60);
        expect(block.bottom.y).toBe(120);
        expect(block.right.y).toBe(70);
        expect(block.right.x).toBe(110);
        expect(block.topRight.x).toBe(110);
        expect(block.topRight.y).toBe(20);
        expect(block.bottomLeft.x).toBe(10);
        expect(block.bottomLeft.y).toBe(120);
        expect(block.bottomRight.x).toBe(110);
        expect(block.bottomRight.y).toBe(120);
    });
    it("Меняем координаты width", function () {
        block.width = 120;
        expect(block.bottom.x).toBe(70);
        expect(block.bottom.y).toBe(110);
        expect(block.right.y).toBe(60);
        expect(block.right.x).toBe(130);
        expect(block.topRight.x).toBe(130);
        expect(block.topRight.y).toBe(10);
        expect(block.bottomLeft.x).toBe(10);
        expect(block.bottomLeft.y).toBe(110);
        expect(block.bottomRight.x).toBe(130);
        expect(block.bottomRight.y).toBe(110);
    });
    it("Меняем координаты height", function () {
        block.height = 120;
        expect(block.bottom.x).toBe(60);
        expect(block.bottom.y).toBe(130);
        expect(block.right.y).toBe(70);
        expect(block.right.x).toBe(110);
        expect(block.topRight.x).toBe(110);
        expect(block.topRight.y).toBe(10);
        expect(block.bottomLeft.x).toBe(10);
        expect(block.bottomLeft.y).toBe(130);
        expect(block.bottomRight.x).toBe(110);
        expect(block.bottomRight.y).toBe(130);
    });
    it("Нижний левый угол заходит в верхний правый сектор", function () {
        var geo = new secondBlock(20, 0, 100, 100);
        var res = block.intersection(geo);
        expect(res.x).toBe(110);
        expect(res.y).toBe(110);
    });
    it("Левый верхний угол в нижний правый сектор", function () {
        var geo = new secondBlock(100, 100, 100, 100);
        var res = block.intersection(geo);
        expect(res.x).toBe(30);
        expect(res.y).toBe(30);
    });
    it("Правый верхний угол в левый нижний сектор", function () {
        var geo = new secondBlock(0, 100, 20, 20);
        var res = block.intersection(geo);
        expect(res.x).toBe(-30);
        expect(res.y).toBe(30);
    });
    it("Правый нижний угол в верхний левый сектрор", function () {
        var geo = new secondBlock(0, 0, 20, 20);
        var res = block.intersection(geo);
        expect(res.x).toBe(-30);
        expect(res.y).toBe(-30);
    });
    it("Случай когда нет соприкосновения", function () {
        var geo = new secondBlock(120, 0, 20, 20);
        var res = block.intersection(geo);
        expect(res).toBeNull();
    });
});