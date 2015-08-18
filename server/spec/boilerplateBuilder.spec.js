"use strict";
describe("Тестирования Шаблоны сущностей", function () {
    var Builder;
    beforeEach(function () {
        Builder = require('./../services/boilerplateBuilder').builder;
    });
    it("Построитель шаблонов", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        let b = new Builder(1);
        let fb = b.getFieldBuilder();
        fb.writeLine("public {type} {name} {{get;set;}}");
        let result = fb.build(fields);
        let exp = '\tpublic string name1 {get;set;}\r\n';
        exp += '\tpublic integer name2 {get;set;}\r\n';
        expect(b.result).toBe(exp);
    });
    it("Построитель шаблонов, без переноса строк", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        let b = new Builder(1);
        let fb = b.getFieldBuilder();
        fb.write("public {type} {name} {{get;set;}}");
        fb.build(fields);
        let exp = '\tpublic string name1 {get;set;}';
        exp += '\tpublic integer name2 {get;set;}';
        expect(b.result).toBe(exp);
    });
    it("Указанны коменты, но в обьекте нет", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        let b = new Builder(1);
        b.getFieldBuilder()
            .commentLine("/// {description}")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = '\tpublic string name1 {get;set;}\r\n';
        exp += '\tpublic integer name2 {get;set;}\r\n';
        expect(b.result).toBe(exp);
    });
    it("Указанны коменты, в обьекте есть", function () {
        let fields = [{name: "name1", type: "string", description: "comment1"}, {
            name: "name2",
            type: "integer",
            description: "comment2"
        }];
        let b = new Builder(1);
        let fb = b.getFieldBuilder();
        fb.commentLine("/// {description}");
        fb.writeLine("public {type} {name} {{get;set;}}");
        fb.build(fields);
        let exp = "\t/// comment1\r\n";
        exp += '\tpublic string name1 {get;set;}\r\n';
        exp += "\t/// comment2\r\n";
        exp += '\tpublic integer name2 {get;set;}\r\n';
        expect(b.result).toBe(exp);
    });
    it("Добавляем чистую строку", function () {
        let b = new Builder();
        b.write("Строка: {0}", 2);
        b.writeLine("Строка: {0}", 3);
        expect(b.result).toBe("Строка: 2Строка: 3\r\n");
    });
    it("Проверяем работу со скобками", function () {
        let b = new Builder();
        let fields = [{name: "name1", type: "string"}];
        b.openBrace = '{\r\n';
        b.closeBrace = '}\r\n';
        b.writeLine("namespace {0}", "my.super");
        b.setOpenBrace();
        b.getFieldBuilder()
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        b.setCloseBrace();
        let exp = "namespace my.super\r\n";
        exp += "{\r\n";
        exp += '\tpublic string name1 {get;set;}\r\n';
        exp += "}\r\n";
        expect(b.result).toBe(exp);
    });
    it("Закрываем скобки разом", function () {
        let b = new Builder();
        b.openBrace = '{\r\n';
        b.closeBrace = '}\r\n';
        b.setOpenBrace();
        b.setOpenBrace();
        b.closeAllBraces();
        let exp = "{\r\n";
        exp += "\t{\r\n";
        exp += '\t}\r\n';
        exp += "}\r\n";
        expect(b.result).toBe(exp);
    });
    it("Используем конструктор обьект", function () {
        let b = new Builder({
            openBrace:'{',
            closeBrace:'}'
        });
        expect(b.openBrace).toBe('{');
        expect(b.closeBrace).toBe('}');
    });
});