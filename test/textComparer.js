/**
 * Created by snekrasov on 18.08.2015.
 */
"use strict";
let async = require('async');
let fs = require('fs');

module.exports.getCompare = function (mod) {
    let obj = {};
    obj.module = mod;
    obj.prototype.compare = function (file, json, example) {
        let self = this;
        async.parallel([
            function (call) {
                fs.readFile(example, 'utf8', call);
            },
            function (call) {
                self.module.render(json, call)
            }
        ], (err, results)=> {
            if (err)
                throw err;
            done();
        });

        module.render(json, (err, result)=> {
            var file = fs.readFileSync(fn, 'utf8');
            //console.log(result.length);
            if (Number.isInteger(i))
                expect(prepare(result[i].text)).toBe(prepare(file));
            else {
                expect(prepare(lodash.findWhere(result, {name: i}).text)).toBe(prepare(file));
            }
            done();
        });
    };
};