/**
 * Created by snekrasov on 19.08.2015.
 */
"use strict";
let tc = require('../../test/textComparer');
describe("Тест textComparer", function () {
    let module, cmp;
    beforeEach(function () {
        module = {
            render: function (json, call) {
                this.json = json;
                call(null, [{text: this.text || "Всякий разный код", name: "file.txt"}]);
            }
        };
    });
    it("Разное количество строк", function (done) {
        let comparer = new tc.textComparer({module: module, json: {}});
        comparer.compareFile(null, __dirname + '/csharp/enum1.txt', (error)=> {
            expect(error).toBe("Данные имеют разное количество строк 8 и 1");
            done();
        })
    });
    it("Строки отличаются", function (done) {
        module.text = "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия";
        let comparer = new tc.textComparer({module: module, json: {}});
        comparer.compareFile(null, __dirname + '/csharp/enum1.txt', (error)=> {
            expect(error).toBe("Строка: 0 имеет различие. 'namespace My.namespace.super' и 'Линия'");
            done();
        })
    });
    it("Строки отличаются, используем текст", function (done) {
        module.text = "Линия\r\n";
        module.text += "Линия\r\n";
        module.text += "Линия";
        let tmp = "Линия\r\n";
        tmp += "ЛиНия\r\n";
        tmp += "Линия";
        let comparer = new tc.textComparer({module: module, json: {}});
        comparer.compareText(null, tmp, (error)=> {
            expect(error).toBe("Строка: 1 имеет различие. 'ЛиНия' и 'Линия'");
            done();
        })
    });
    it("Тестируем вызов избирательной сущности", function (done) {
        let tmp = {entities: [{name: "name1"}, {name: "name2"}, {name: "name3"}]};
        let comparer = new tc.textComparer({
            module: module,
            json: tmp
        });
        comparer.entityCompare("name1", __dirname + '/csharp/enum1.txt',  (error)=> {
            expect(module.json).not.toBe(tmp);
            expect(module.json.entities.length).toBe(1);
            done();
        })
    });
    it("Меняем вопрос", function () {
        let tmp = {entities: [{name: "name1"}, {name: "name2"}, {name: "name3"}], answers:[false]};
        let comparer = new tc.textComparer({
            module: module,
            json: tmp
        });
        expect(comparer.json.answers[0]).toBeFalsy();
        comparer.setAnswer(0,true);
        expect(comparer.json.answers[0]).toBeTruthy();
        expect(comparer.json.answers).not.toBe(tmp.answers);
    });
});
