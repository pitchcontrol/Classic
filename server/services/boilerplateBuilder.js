/**
 * Created by snekrasov on 14.08.2015.
 */
"use strict";
let format = require('string-format');
let lodash = require('lodash-node');

const WRITE = 0;
const wl = 1;
const c = 2;
const cl = 3;
const tag = 4;
const tagL = 5;
const closeAllTagsL = 6;
const tagWithBodyL = 7;
const closeLastTagL = 8;
const openBrace = 9;
const closeAllBraces = 10;
const closeBrace = 11;
const scheduleBuild = 12;
const tagSelfCloseL = 13;
const tagSelfClose = 14;
const writeWithoutIndentL = 15;
const writeLineOpenBrace = 16;
const setBraces = 17;
const closeBraceLine = 18;
const IF = 19;
const IF_LINE = 20;
/**
 * Создает экземпляр FieldBuilder
 * @constructor
 * @param {Builder} builder экземпляр Builder
 * @param parent
 */
function FieldBuilder(builder, parent) {
    this.chain = [];
    this._builder = builder;
    this._localBuilder = Object.create(builder);
    this._parentBuilder = parent;
    this.switch = [];
    this.switch.push({chain: []});
    this._currentCase = null;
}
FieldBuilder.prototype.getCurrentCase = function () {
    if (!this._currentCase)
        return this.switch[0].chain;
    let result = lodash.findWhere(this.switch, {name: this._currentCase.name, value: this._currentCase.value});
    if (!result)
        return this.switch[0].chain;
    return result.chain;
};
FieldBuilder.prototype.setCase = function (name, value) {
    let result = lodash.findWhere(this.switch, {name: name, value: value});
    if (!result) {
        let obj = {name: name, value: value, chain: []};
        this.switch.push(obj);
        this._currentCase = obj;
    } else {
        this._currentCase = result;
    }
    return this;
};

FieldBuilder.prototype._findSwitch = function (filed) {
    //Перебор полей поиск соответсвия
    for (let i = 1; i < this.switch.length; i++) {
        let prop = filed[this.switch[i].name];
        let value = this.switch[i].value;
        if (prop != undefined && prop == value) {
            return this.switch[i];
        }
    }
    return this.switch[0];
};
/**
 * Получить цепочку вызовов
 * @private
 * @return {Array} Цепочка вызовов.
 */
FieldBuilder.prototype._findChain = function (filed) {
    return this._findSwitch(filed).chain;
};

FieldBuilder.prototype.setIndent = function (indent) {
    this.numberIndents = indent;
    return this;
};
/**
 * Вставить форматированную строку
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.write = function (format) {
    this.getCurrentCase().push({type: WRITE, format: format});
    return this;
};
/**
 * Вставить форматированную строку и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeLine = function (format) {
    this.getCurrentCase().push({type: wl, format: format});
    return this;
};
/**
 * Вставить форматированную строку, перенос строки и открытие скобки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeLineOpenBrace = function (format) {
    this.getCurrentCase().push({type: writeLineOpenBrace, format: format});
    return this;
};
/**
 * Вставить форматированную строку без отступа и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeWithoutIndentLine = function (format) {
    this.getCurrentCase().push({type: writeWithoutIndentL, format: format});
    return this;
};
/**
 * Вставить форматированную строку если есть description
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.comment = function (format) {
    this.getCurrentCase().push({type: c, format: format});
    return this;
};
/**
 * Вставить форматированную строку если есть description и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.commentLine = function (format) {
    this.getCurrentCase().push({type: cl, format: format});
    return this;
};
/**
 * Вставить форматированную строку если есть поле name == value
 * @param {string} name имя поля в оббъекте
 * @param {*} value значение поля name
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.if = function (name, value, format) {
    this.getCurrentCase().push({type: IF, name: name, value: value, format: format});
    return this;
};
/**
 * Вставить форматированную строку если есть поле name == value и перенос строки
 * @param {string} name имя поля в оббъекте
 * @param {*} value значение поля name
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.ifLine = function (name, value, format) {
    this.getCurrentCase().push({type: IF_LINE, name: name, value: value, format: format});
    return this;
};
/**
 * Вставить тэг
 * @param {string} t имя тэга
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeTag = function (t, format) {
    this.getCurrentCase().push({type: tag, format: format, tagName: t});
    return this;
};
/**
 * Вставить тэг и перенос строки
 * @param {string} t имя тэга
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeTagLine = function (t, format) {
    this.getCurrentCase().push({type: tagL, format: format, tagName: t});
    return this;
};
/**
 * Вставить тэг с телом и перенос строки
 * @param {string} t имя тэга
 * @param {string} format форматированная строка
 * @param {string} body форматированная строка тело тэга
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeTagWithBodyLine = function (t, format, body) {
    this.getCurrentCase().push({type: tagWithBodyL, format: format, tagName: t, body: body});
    return this;
};
/**
 * Вставить самозакрывающийся тэг и перенос строки
 * @param {string} t имя тэга
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeTagSelfCloseLine = function (t, format) {
    this.getCurrentCase().push({type: tagSelfCloseL, format: format, tagName: t});
    return this;
};
/**
 * Вставить самозакрывающийся тэг
 * @param {string} t имя тэга
 * @param {string} format форматированная строка
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.writeTagSelfClose = function (t, format) {
    this.getCurrentCase().push({type: tagSelfClose, format: format, tagName: t});
    return this;
};
/**
 * Закрыть все тэги и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.closeAllTagsLine = function () {
    this.getCurrentCase().push({type: closeAllTagsL});
    return this;
};
/**
 * Закрыть последний тэг и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.closeLastTagLine = function () {
    this.getCurrentCase().push({type: closeLastTagL});
    return this;
};
/**
 * Вставить раскрывающуюся скобку
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.setOpenBrace = function () {
    this.getCurrentCase().push({type: openBrace});
    return this;
};
/**
 * Вставить закрывающуюся скобку
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.setCloseBrace = function () {
    this.getCurrentCase().push({type: closeBrace});
    return this;
};
/**
 * Вставить закрывающуюся скобку и перенос строки
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.setCloseBraceLine = function () {
    this.getCurrentCase().push({type: closeBraceLine});
    return this;
};
/**
 * Вставить закрывающуюся скобку
 * @return {FieldBuilder} Объект FieldBuilder.
 */
FieldBuilder.prototype.closeAllBraces = function () {
    this.getCurrentCase().push({type: closeAllBraces});
    return this;
};
/**
 * Функция фильтр для фильтрации
 * @param {function} filter Функция фильр
 * @return {FieldBuilder} обьект FieldBuilder.
 */
FieldBuilder.prototype.setFilter = function (filter) {
    this._filter = filter;
    return this;
};
/**
 * Задать скобки
 * @param {string} openBrace Открывающаяся скобка
 * @param {string} closeBrace Закрывающаяся скобка
 * @returns {FieldBuilder}
 */
FieldBuilder.prototype.setBraces = function (openBrace, closeBrace) {
    this.getCurrentCase().push({type: setBraces, openBrace: openBrace, closeBrace: closeBrace});
    return this;
};
/**
 * Запланировать построение
 * @param {string} collection Имя колекции, по которой будет перебор
 * @return {FieldBuilder} обьект FieldBuilder.
 */
FieldBuilder.prototype.sheduleBuild = function (collection) {
    this._parentBuilder.getCurrentCase().push({type: scheduleBuild, builder: this, collection: collection});
    return this;
};
FieldBuilder.prototype.build = function (collection, render) {
    let indent = '';
    let str = '';
    let renderFiles = [];

    if (Array.isArray(render)) {
        renderFiles = render;
    }

    let self = this;
    let iterator = this._filter ? collection.filter(this._filter) : collection;
    iterator.forEach((field, index, array)=> {
        let last = (index < array.length - 1) ? self._localBuilder.markEnd : '';
        let swt = self._findSwitch(field);
        swt.chain.forEach((itm, ind, arr)=> {
            indent = self._builder.indent.repeat(self._builder.numberIndents);
            switch (itm.type) {
                case writeWithoutIndentL:
                    self._builder.result += format(itm.format, field) + last + '\r\n';
                    break;
                case WRITE:
                    self._builder.result += indent + format(itm.format, field) + last;
                    break;
                case wl:
                    self._builder.result += indent + format(itm.format, field) + last + '\r\n';
                    break;
                case c:
                    if (field.description)
                        this._builder.result += indent + format(itm.format, field);
                    break;
                case IF:
                    if(field[itm.name] == itm.value)
                        this._builder.result += indent + format(itm.format, field);
                    break;
                case IF_LINE:
                    if(field[itm.name] == itm.value)
                        this._builder.result += indent + format(itm.format, field)+ '\r\n';
                    break;
                case openBrace:
                    self._builder.result += indent + self._localBuilder.openBrace;
                    self._builder.numberIndents++;
                    break;
                case closeBrace:
                case closeBraceLine:
                    self._builder.numberIndents--;
                    indent = self._builder.indent.repeat(self._builder.numberIndents);
                    self._builder.result += indent + self._localBuilder.closeBrace;
                    if (itm.type === closeBraceLine)
                        self._builder.result += '\r\n';
                    break;
                case closeAllBraces:
                    while (self._builder.numberIndents > 0) {
                        self._builder.numberIndents--;
                        indent = self._builder.indent.repeat(self._builder.numberIndents);
                        self._builder.result += indent + self._localBuilder.closeBrace;
                    }
                    break;
                case cl:
                    if (field.description)
                        self._builder.result += indent + format(itm.format, field) + '\r\n';
                    break;
                //Открывается тэг нужно его отобразить и добавить в колецию тэгов
                //добавить отступ
                case tag:
                case tagL:
                    str = itm.format ? format(itm.format, field) : '';
                    self._builder.result += indent + (str ? ('<' + itm.tagName + ' ' + str + '>') : ('<' + itm.tagName + '>'));
                    if (itm.type === tagL)
                        self._builder.result += '\r\n';
                    self._builder.numberIndents++;
                    if (swt.tags == undefined)
                        swt.tags = [];

                    swt.tags.push(itm.tagName);
                    break;
                //Самозакрывающийся тэг
                case tagSelfCloseL:
                case tagSelfClose:
                    str = itm.format ? format(itm.format, field) : '';
                    self._builder.result += indent + (str ? ('<' + itm.tagName + ' ' + str + '/>') : ('<' + itm.tagName + '/>'));
                    if (itm.type === tagSelfCloseL)
                        self._builder.result += '\r\n';
                    break;
                //Закрываем все тэги
                case closeAllTagsL:
                    //for (let index = itm.tags.length - 1; index >= 0; index--)
                    while (swt.tags && swt.tags.length > 0) {
                        self._builder.numberIndents--;
                        indent = self._builder.indent.repeat(self._builder.numberIndents);
                        self._builder.result += indent + '</' + swt.tags.pop() + '>\r\n';
                    }
                    break;
                //тэг с телом
                case tagWithBodyL:
                    //Сам тэг
                    str = itm.format ? format(itm.format, field) : '';
                    self._builder.result += indent + (str ? ('<' + itm.tagName + ' ' + str + '>') : ('<' + itm.tagName + '>'));
                    //его содержимое
                    self._builder.result += format(itm.body, field);
                    //Закрываем тэг
                    self._builder.result += format("</{0}>\r\n", itm.tagName);
                    break;
                case closeLastTagL:
                    self._builder.numberIndents--;
                    indent = self._builder.indent.repeat(self._builder.numberIndents);
                    if (swt.tags && swt.tags.length > 0)
                        str = swt.tags.pop();
                    //Закрываем тэг
                    self._builder.result += indent + format("</{0}>\r\n", str);
                    break;
                //Собираем запланированный шаблон
                case scheduleBuild:
                    itm.builder.build(field[itm.collection]);
                    break;
                case writeLineOpenBrace:
                    if (self._builder.braceInline) {
                        self._builder.result += indent + format(itm.format, field) + self._localBuilder.openBrace + '\r\n';
                    }
                    else {
                        self._builder.result += indent + format(itm.format, field) + '\r\n';
                        self._builder.result += indent + self._localBuilder.openBrace;
                    }
                    self._builder.numberIndents++;
                    break;
                case setBraces:
                    self._localBuilder.openBrace = itm.openBrace || self._localBuilder.openBrace;
                    self._localBuilder.closeBrace = itm.closeBrace || self._localBuilder.closeBrace;
                    break;
            }
        });
        //Отработает генерация итема
        if (render) {
            renderFiles.push({name: format(self._builder.fileNameFormat, field), text: self.trimEnd()});
            self._builder.result = '';
        }
    });
    return render ? renderFiles : this;
};
/**
 * Задать формат имени файла
 * @param {string} format формат имени файла
 * @return {FieldBuilder} обьект FieldBuilder.
 */
FieldBuilder.prototype.setFileNameFormat = function (format) {
    this._builder.fileNameFormat = format;
    return this;
};
/**
 * Получить итоговую строку без пробелов в конце
 * @return {string} Строка.
 */
FieldBuilder.prototype.trimEnd = function () {
    return this._builder.result.replace(/\s+$/, '');
};
/**
 * Получить дочерний построитель
 * @return {FieldBuilder} обьект FieldBuilder.
 */
FieldBuilder.prototype.getBuilder = function (setting) {
    let obj = new FieldBuilder(this._builder, this);
    if (!setting)
        return obj;
    for (var key in setting) {
        obj._localBuilder[key] = setting[key];
    }
    return obj;
};
function Aggregator() {
    this.result = '';
    this.numberIndents = 0;
}

module.exports.getHtmlBuilder = function () {
    let agr = new Aggregator();
    agr.markEnd = '';
    agr.openBrace = '';
    agr.closeBrace = '';
    agr.indent = '    ';
    agr.fileNameFormat = "{name}.html";
    agr.braceInline = false;
    return new FieldBuilder(agr);
};
module.exports.getChsarpBuilder = function () {
    let agr = new Aggregator();
    agr.markEnd = '';
    agr.openBrace = '{\r\n';
    agr.closeBrace = '}\r\n';
    agr.indent = '    ';
    agr.fileNameFormat = "{name}.cs";
    agr.braceInline = false;
    return new FieldBuilder(agr);
};
module.exports.getJavaScriptBuilder = function () {
    let agr = new Aggregator();
    agr.markEnd = '';
    agr.openBrace = '{';
    agr.closeBrace = '}';
    agr.indent = '    ';
    agr.fileNameFormat = "{name}.js";
    agr.braceInline = true;
    return new FieldBuilder(agr);
};
