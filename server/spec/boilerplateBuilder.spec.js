"use strict";
describe("Тестирования Шаблоны сущностей", function () {
    var javaScripBuilderBuilder, htmlBuilder, csharpBuilder;
    beforeEach(function () {
        htmlBuilder = require('./../services/boilerplateBuilder').getHtmlBuilder();
        csharpBuilder = require('./../services/boilerplateBuilder').getChsarpBuilder();
        javaScripBuilderBuilder = require('./../services/boilerplateBuilder').getJavaScriptBuilder();
    });
    it("Строим простые строки", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        csharpBuilder.writeLine("public {type} {name} {{get;set;}}");
        csharpBuilder.build(fields);
        let exp = 'public string name1 {get;set;}\r\n';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Строим простые строки, без переноса строк", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        csharpBuilder.write("public {type} {name} {{get;set;}}");
        csharpBuilder.build(fields);
        let exp = 'public string name1 {get;set;}';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Работаем с тэгами", function () {
        let fields = [{name: "name1", type: "string"}];
        htmlBuilder.writeTagLine("div");
        htmlBuilder.writeTagLine("div", "class='my-class'");
        htmlBuilder.closeAllTagsLine();
        htmlBuilder.build(fields);
        let exp = '<div>\r\n';
        exp += "    <div class='my-class'>\r\n";
        exp += "    </div>\r\n";
        exp += "</div>";
        expect(htmlBuilder.trimEnd()).toBe(exp);
    });
    it("Открываем тэг, новая строка", function () {
        htmlBuilder.writeTagLine("div", "myAttribute='{age}'");
        htmlBuilder.build([{name: "name1", type: "string", age: 3}]);
        expect(htmlBuilder.trimEnd()).toBe("<div myAttribute='3'>");
        //Добавился отступ
        expect(htmlBuilder._builder.numberIndents).toBe(1);
    });
    it("Тэг с содержимым и закрыть все тэги", function () {
        let fields = [{name: "name1", type: "string"}];
        htmlBuilder
            .writeTagLine("div", "class='my-class'")
            .writeTagWithBodyLine("p", "", "Мой параграф")
            .closeAllTagsLine()
            .build(fields);
        let exp = "<div class='my-class'>\r\n";
        exp += "    <p>Мой параграф</p>\r\n";
        exp += "</div>";
        expect(htmlBuilder.trimEnd()).toBe(exp);
    });
    it("Указанны коменты, но в обьекте нет", function () {
        let fields = [{name: "name1", type: "string"}, {name: "name2", type: "integer"}];
        csharpBuilder
            .commentLine("/// {description}")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = 'public string name1 {get;set;}\r\n';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Указанны коменты, в обьекте есть", function () {
        let fields = [{name: "name1", type: "string", description: "comment1"}, {
            name: "name2",
            type: "integer",
            description: "comment2"
        }];
        csharpBuilder.commentLine("/// {description}")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = "/// comment1\r\n";
        exp += 'public string name1 {get;set;}\r\n';
        exp += "/// comment2\r\n";
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Проверяем работу со скобками", function () {
        csharpBuilder.writeLine("namespace {namespace}")
            .setOpenBrace()
            .getBuilder()
            //Дочерний билдер
            .writeLine("public {type} {name} {{get;set;}}")
            .sheduleBuild("fields");
        csharpBuilder.setCloseBrace()
            .build([{namespace: "my.super", fields: [{name: "name1", type: "string"}]}]);
        let exp = "namespace my.super\r\n";
        exp += "{\r\n";
        exp += '    public string name1 {get;set;}\r\n';
        exp += "}";
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Закрываем скобки разом", function () {
        csharpBuilder
            .setOpenBrace()
            .setOpenBrace()
            .closeAllBraces()
            .build([{}]);
        let exp = "{\r\n";
        exp += "    {\r\n";
        exp += '    }\r\n';
        exp += "}";
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Строка и открытие скобки", function () {
        csharpBuilder.writeLineOpenBrace("namespace")
            .build([{}]);
        let exp = "namespace\r\n";
        exp += "{";
        expect(csharpBuilder.trimEnd()).toBe(exp);
        //При это сдвигается отступ
        expect(csharpBuilder._builder.numberIndents).toBe(1);
    });
    it("Работа в режиме рендиринг", function () {
        let result = csharpBuilder
            .setOpenBrace()
            .setOpenBrace()
            .closeAllBraces()
            .build([{name: "name1"}, {name: "name2"}], true);
        let exp = "{\r\n";
        exp += "    {\r\n";
        exp += '    }\r\n';
        exp += "}";
        expect(result.length).toBe(2);
        expect(result[0].name).toBe("name1.cs");
        expect(result[0].text).toBe(exp);
    });
    it("Работа в режиме рендиринг на основе массива", function () {
        let result = csharpBuilder
            .setOpenBrace()
            .setOpenBrace()
            .closeAllBraces()
            .build([{name: "name1"}, {name: "name2"}], [{name: "old.cs", text: "Text"}]);
        let exp = "{\r\n";
        exp += "    {\r\n";
        exp += '    }\r\n';
        exp += "}";
        expect(result.length).toBe(3);
        expect(result[1].name).toBe("name1.cs");
        expect(result[1].text).toBe(exp);
    });

    it("Закрываем тэг", function () {
        htmlBuilder.writeTagLine("div", "myAttribute='{age}'")
            .closeLastTagLine()
            .build([{name: "name1", type: "string", age: 3}]);
        let exp = "<div myAttribute='3'>\r\n";
        exp += "</div>";
        expect(htmlBuilder.trimEnd()).toBe(exp);
        expect(htmlBuilder._builder.numberIndents).toBe(0);
    });
    it("Закрываем тэг, новая строка", function () {
        htmlBuilder.writeTagLine("div", "myAttribute='{age}'")
            .closeLastTagLine()
            .build([{name: "name1", type: "string", age: 3}]);
        let exp = "<div myAttribute='3'>\r\n";
        exp += "</div>";
        expect(htmlBuilder.trimEnd()).toEqual(exp);
        expect(htmlBuilder._builder.numberIndents).toEqual(0);
    });
    it("Тестируем поиск case", function () {
        let fb = htmlBuilder;
        fb.switch.push({name: "name1", value: "value1", chain: ["first"]});
        fb.switch.push({name: "name1", value: "value2", chain: ["second"]});
        fb.switch.push({name: "name2", value: "value2", chain: ["third"]});
        let cs = fb.getCurrentCase();
        //Умолчание
        expect(cs.length).toBe(0);
        //Нет соответсвия
        fb._currentCase = {name: "name1", value: "value"};
        cs = fb.getCurrentCase();
        expect(cs.length).toBe(0);
        //Есть соответсвие
        fb._currentCase = {name: "name1", value: "value1"};
        cs = fb.getCurrentCase();
        expect(cs[0]).toBe("first");
    });
    it("Установка кейса, setCase", function () {
        let fb = htmlBuilder;
        let obj = {name: "name1", value: "value1", chain: ["first"]};
        fb.switch.push(obj);
        expect(fb.switch.length).toBe(2);
        fb.setCase("name1", "value1");
        expect(fb._currentCase).toEqual(obj);
        expect(fb.switch.length).toBe(2);
    });
    it("Установка кейса, он должен добавится в колекцию", function () {
        let fb = htmlBuilder;
        let obj = {name: "name1", value: "value1", chain: []};
        expect(fb.switch.length).toBe(1);
        fb.setCase("name1", "value1");
        expect(fb._currentCase).toEqual(obj);
        expect(fb.switch.length).toBe(2);
    });
    it("Ишем соответсвие полю", function () {
        let fb = htmlBuilder;
        fb.switch.push({name: "name1", value: "value1", chain: ["first"]});
        fb.switch.push({name: "name", value: "value2", chain: ["second"]});
        fb.switch.push({name: "name2", value: "value2", chain: ["third"]});
        //Нет соответсвия
        let field = {myProperty: "myProperty"};
        let chain = fb._findChain(field);
        expect(chain.length).toBe(0);
        field = {name: "value2"};
        chain = fb._findChain(field);
        expect(chain[0]).toBe("second");
    });
    it("Тестируем switch case", function () {
        let fb = htmlBuilder;
        fb.writeLine("default: {value}")
            .setCase("type", "uid")
            .writeLine("uid: {value}")
            .setCase("type", "datetime")
            .writeLine("datetime: {value}");
        let fields = [
            {type: "string", value: "stringValue"},
            {type: "uid", value: "uidValue"},
            {type: "datetime", value: "datetimeValue"}
        ];
        fb.build(fields);
        let result = "default: stringValue\r\n";
        result += "uid: uidValue\r\n";
        result += "datetime: datetimeValue";
        expect(htmlBuilder.trimEnd()).toBe(result);
    });
    it("Меняем настройки дочернему билдеру", function () {
        javaScripBuilderBuilder.writeLineOpenBrace("Привет")
            .getBuilder()
            .setBraces("({", "})")
            .writeLineOpenBrace("Пока")
            .setCloseBraceLine()
            .sheduleBuild("fields");
        javaScripBuilderBuilder.closeAllBraces()
            .build([{name: "name1", fields: [{}]}]);
        let exp = "Привет{\r\n";
        exp += "    Пока({\r\n";
        exp += '    })\r\n';
        exp += "}";
        expect(javaScripBuilderBuilder.trimEnd()).toBe(exp);
    });
    it("Меняем настройки дочернему билдеру", function () {
        javaScripBuilderBuilder.writeLineOpenBrace("Привет")
            .getBuilder({openBrace: "({", closeBrace: "})"})
            .writeLineOpenBrace("Пока")
            .setCloseBraceLine()
            .sheduleBuild("fields");
        javaScripBuilderBuilder.closeAllBraces()
            .build([{name: "name1", fields: [{}]}]);
        let exp = "Привет{\r\n";
        exp += "    Пока({\r\n";
        exp += '    })\r\n';
        exp += "}";
        expect(javaScripBuilderBuilder.trimEnd()).toBe(exp);
    });
    it("Проверяем условия вывода, не проходят", function () {
        let fields = [{name: "name1", type: "string", isRequired: false}, {
            name: "name2",
            type: "integer",
            description: "comment2"
        }];
        csharpBuilder.if('isRequired', true, "[Required]")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = '';
        exp += 'public string name1 {get;set;}\r\n';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Проверяем условия вывода, проходят", function () {
        let fields = [{name: "name1", type: "string", isRequired: true}, {
            name: "name2",
            type: "integer",
            description: "comment2"
        }];
        csharpBuilder.if('isRequired', true, "[Required]")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = '[Required]';
        exp += 'public string name1 {get;set;}\r\n';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
    it("Проверяем условия вывода, проходят, новая строка", function () {
        let fields = [{name: "name1", type: "string", isRequired: true}, {
            name: "name2",
            type: "integer",
            description: "comment2"
        }];
        csharpBuilder.ifLine('isRequired', true, "[Required]")
            .writeLine("public {type} {name} {{get;set;}}")
            .build(fields);
        let exp = '[Required]\r\n';
        exp += 'public string name1 {get;set;}\r\n';
        exp += 'public integer name2 {get;set;}';
        expect(csharpBuilder.trimEnd()).toBe(exp);
    });
});