/**
 * Created by snekrasov on 14.08.2015.
 */
"use strict";
let format = require('string-format');

module.exports.builder = Builder;
const w = 0;
const wl = 1;
const c = 2;
const cl = 3;

function Builder(numberIndents, indent, markEnd) {
    if (!!numberIndents && numberIndents.constructor === Object) {
        for (let o in numberIndents) {
            this[o] = numberIndents[o];
        }
    }
    else {
        this.numberIndents = numberIndents;
        this.indent = indent;
        this.markEnd = markEnd || '';
    }
    this.indent = this.indent || '\t';
    this.numberIndents = this.numberIndents || 0;
    this.result = '';
}
/**
 * Вставить раскрывающуюся скобку
 * @return {Builder} Объект Builder.
 */
Builder.prototype.setOpenBrace = function () {
    for (var indent = ''; indent.length < this.numberIndents; indent += this.indent);
    this.result += indent + this.openBrace;
    this.numberIndents++;
    return this;
};
/**
 * Вставить закрывающуюся скобку
 * @return {Builder} Объект Builder.
 */
Builder.prototype.setCloseBrace = function () {
    this.numberIndents--;
    for (var indent = ''; indent.length < this.numberIndents; indent += this.indent);
    this.result += indent + this.closeBrace;
    return this;
};
Builder.prototype.closeAllBraces = function () {
    while (this.numberIndents > 0) {
        this.setCloseBrace();
    }
};
/**
 * Вставить форматированную строку
 * @return {Builder} Объект Builder.
 */
Builder.prototype.write = function () {
    for (var indent = ''; indent.length < this.numberIndents; indent += this.indent);
    this.result += indent + format.apply(this, arguments);
    return this;
};
/**
 * Вставить форматированную строку и перенос строки
 * @return {Builder} Объект Builder.
 */
Builder.prototype.writeLine = function () {
    for (var indent = ''; indent.length < this.numberIndents; indent += this.indent);
    this.result += indent + format.apply(this, arguments) + '\r\n';
    return this;
};
/**
 * Вставить форматированную строку, перенос строки
 * и открыть скобку
 * @return {Builder} Объект Builder.
 */
Builder.prototype.writeLineOpenBrace = function () {
    this.writeLine.apply(this, arguments);
    this.setOpenBrace();
    return this;
};
/**
 * Получить обьект FieldBuilder
 * @return {FieldBuilder} Объект FieldBuilder.
 */
Builder.prototype.getFieldBuilder = function (markEnd) {
    return new FieldBuilder(this, markEnd);
};
/**
 * Создает экземпляр FieldBuilder
 * @constructor
 * @param {Builder} builder экземпляр Builder
 */
function FieldBuilder(builder, markEnd) {
    this.chain = [];
    this.builder = builder;
    this.markEnd = markEnd || builder.markEnd;
}

FieldBuilder.prototype.write = function (format) {
    this.chain.push({type: w, format: format});
    return this;
};

FieldBuilder.prototype.writeLine = function (format) {
    this.chain.push({type: wl, format: format});
    return this;
};

FieldBuilder.prototype.comment = function (format) {
    this.chain.push({type: c, format: format});
    return this;
};

FieldBuilder.prototype.commentLine = function (format) {
    this.chain.push({type: cl, format: format});
    return this;
};

FieldBuilder.prototype.build = function (collection) {
    let result = '';
    let indent = '';
    for (let i = 0; i < this.builder.numberIndents; i++)
        indent += this.builder.indent;
    let self = this;
    collection.forEach((field, index, array)=> {
        let last = (index < array.length - 1) ? self.markEnd : '';
        self.chain.forEach((itm, ind, arr)=> {
            switch (itm.type) {
                case w:
                    result += indent + format(itm.format, field) + last;
                    break;
                case wl:
                    result += indent + format(itm.format, field) + last + '\r\n';
                    break;
                case c:
                    if (field.description)
                        result += indent + format(itm.format, field);
                    break;
                case cl:
                    if (field.description)
                        result += indent + format(itm.format, field) + '\r\n';
                    break;
            }
        })
    });
    this.builder.result += result;
    return this;
};
