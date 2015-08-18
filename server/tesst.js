"use strict";
let mockery = require('../node_modules/mockery');

let bcrypt = require('../node_modules/bcrypt');


bcrypt.hash('1', 8, function (err, hash) {
    console.log(hash);
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
let prom4 = Promise.all([prom1,prom3]);
prom4.then(function (obj) {
    console.log('All',obj);
});