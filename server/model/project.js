/**
 * Created by snekrasov on 03.07.2015.
 */
"use strict";
var Serialize = require('sequelize');
var sq = require('../services/db').sequelize;

let project = sq.define('project', {
    id: {type: Serialize.INTEGER, primaryKey: true, autoIncrement: true},
    name: Serialize.STRING,
    diagram: Serialize.JSON
});


module.exports.Project = project;
