"use strict";
let mockery = require('../node_modules/mockery');

let bcrypt = require('../node_modules/bcrypt-nodejs');

bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash('1', salt, null, function (err, hash) {
        console.log('ERROR', err);
        console.log('HASH', hash);
    });
});
console.log('End');

mockery.registerMock('myModule', {
    ok: ()=> {
        console.log('ok1');
    }
});
mockery.enable({warnOnUnregistered: false, warnOnReplace: false, useCleanCache: false});
let myModule = require('myModule');
myModule.ok();


mockery.registerMock('myModule', {
    ok: ()=> {
        console.log('ok2');
    }
});
myModule = require('myModule');
myModule.ok();


let prom1 = Promise.resolve('Resolve');
prom1.then(function (obj) {
    console.log(obj);
});
let prom2 = Promise.reject('Reject');
prom2.then(null, function (obj) {
    console.log(obj);
});
prom2.catch(function (obj) {
    console.log('catch', obj);
});

let prom3 = Promise.resolve('Resolve');
let prom4 = Promise.all([prom1, prom3]);
prom4.then(function (obj) {
    console.log('All', obj);
});
class MyClass {
    constructor(options) {
        this.a = options;
    }

    write() {
        console.log(this.a);
    }
}
let mc = new MyClass("hellow");
mc.write();
console.log(`string text ${mc.a + ' world'}`);
var error = require('../server/errors/notFoundError').notFoundError;
var erraut = require('../server/errors/authenticateError').authenticateError;
var e1 = new error('My error 1');
var e2 = new error('My error 2');
console.log('instanceof',e1 instanceof error);
console.log('instanceof',e2 instanceof erraut);
console.log('instanceof',e2 instanceof Error);
