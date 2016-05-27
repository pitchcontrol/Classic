/**
 * Created by Станислав on 27.05.2016.
 */
"use strict";
let _ = require('lodash-node');

module.exports.build = function (project) {
    project.entities.forEach((entity)=> {
        entity.fields.forEach((field)=> {
            switch (field.type) {
                case 'Association':
                    let name = field.associationObj.start.name;
                    field.associationObj.start = _.find(project.entities, {name: name});
                    break;
                case 'enum':
                    field.enum = _.find(project.enums, {name: field.enum});
                    break;
            }
            if (field.isPrimaryKey === true)
                entity.primaryKey = field;
        });
        entity.answers = project.answers;
    });
};