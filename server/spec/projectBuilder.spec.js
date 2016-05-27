/**
 * Created by Станислав on 27.05.2016.
 */
"use strict";
let projectBuilder = require('../services/projectBuilder');
let _ = require('lodash-node');

describe("Тестирования projectBuilder", function () {
    var project;
    beforeEach(function () {
        delete require.cache[require.resolve('../spec/projectBuilder.json')];
        project = require('../spec/projectBuilder.json');
        projectBuilder.build(project);
    });
    it("Проверка enum", function () {
        let entity = _.find(project.entities, {name: 'myEntity4'});
        let enm = _.find(project.enums, {name: 'Enum1'});
        let field = _.find(entity.fields, {name: 'myEntities'});
        expect(field.enum).toBe(enm);
    });
    it("Проверка ассоциаций", function () {
        let entity1 = _.find(project.entities, {name: 'myEntity2'});
        let entity2 = _.find(project.entities, {name: 'myEntity'});
        let field = _.find(entity1.fields, {name: 'myEntities'});
        expect(field.associationObj.start).toBe(entity2);
    });

});