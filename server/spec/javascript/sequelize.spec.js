/**
 * Created by snekrasov on 17.07.2015.
 */
var fs = require('fs');
describe("Генератор модели sequelize", function () {
    var module, json;
    beforeEach(function () {
        module = require('../../templates/javascript/sequelize');
        json = require('./../javascript/sequelize.json');
    });
    function prepare(str) {
        return str.replace(/\s+/g, ' ');
    };
    function compare(i, fn, done) {
        var result = module.render(json, (err, result)=> {
            var file = fs.readFileSync(fn, 'utf8');
            expect(prepare(result[i].text)).toBe(prepare(file));
            done();
        });
    }

    it("Тест файла инициализации", function (done) {
        compare(0, 'server/spec/javascript/sequelizeInit.txt', done);
    });
    it("Тест простая модель", function (done) {
        compare(1, 'server/spec/javascript/sequelize1.txt', done);
    });
    it("Тест связи один к одному", function (done) {
        compare(2, 'server/spec/javascript/sequelize2.txt', done);
    });
    it("Тест связи один ко многим", function (done) {
        compare(3, 'server/spec/javascript/sequelize3.txt', done);
    });
    it("Тест связи enum", function (done) {
        compare(4, 'server/spec/javascript/sequelize4.txt', done);
    });
});