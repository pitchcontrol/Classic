/**
 * Created by snekrasov on 30.04.2015.
 */
function Entity(diagramService) {
    "use strict";
    var self = this;
    //Колекция сущностей
    this.diagramService = diagramService;
    //Колекция где хранятся связи в которых данная сущность будет началом
    this.outerAssociation = [];
    var _name = "entity";
    this.fields = [];
    //Текущее выбранное поле
    this.currentField = null;
    //Колекция ошибок для поля
    this.errors = {
        name: {}
    };
    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            if (_.findWhere(diagramService.entities, {name: value}) == undefined) {
                _name = value;
                delete this.errors.name.dublicateName;
            } else {
                this.errors.name.dublicateName = value + ', уже есть';
            }
        }
    });
    //Бегает по полям и ишет ощибки
    Object.defineProperty(this, 'error', {
        get: function () {
            var error = undefined;
            _.forEach(this.errors, function (k, v) {
                _.forEach(k, function (sv, sk) {
                    if (sv)
                        error = sv;
                });
            });
            if (error !== undefined)
                return error;
            _.forEach(this.fields, function (value) {
                _.forEach(value.errors, function (k, v) {
                    _.forEach(k, function (sv, sk) {
                        if (sv)
                            error = sv;
                    });
                });
            });
            return error;
        }
    });
    this.addField = function (field) {
        var fl = new Field(this);
        //Добавляем флаг для возможности отката
        fl.added = true;
        if (field) {
            fl.enum = field.enum;
            fl.name = field.name;
            fl.type = field.type;
            fl.description = field.description;
            //Если тут ассоциация то надо найти сущность и выставить
            //планирование
            if (fl.type == 'Association') {

                //Тут может быть не вся колекция
                //var fEntity = diagramService.findEntity(field.associationObj.start.name);
                this.diagramService.shedule.push({
                    field: fl,
                    entity: field.associationObj.start.name,
                    multiplicity: field.associationObj.multiplicity
                })
            }
            //Если тут enum то надо найти enum и выставить ссылку
            if (fl.type == 'enum') {
                fl.enum = diagramService.enums.findByName(fl.enum);
            }
            //Если мы грузим то id будет задан
            if (!field.id)
                fl.id = self._integerCounter.getId();
        } else {
            fl.id = self._integerCounter.getId();
            fl.name = "field" + fl.id;
        }
        this.fields.push(fl);
        return fl;
    };
    this.removeField = function () {
        var index;
        if (this.currentField) {
            if (this.currentField.association) {
                diagramService.associations.remove(this.currentField.associationObj);
            }
            ;
            this.fields.remove(this.currentField);
            this.currentField = null;
        }
    };
    //Будет вызыватся при удалении сущности
    this.destroy = function () {
        this.fields.forEach(function (item) {
            item.association = null;
        });
    };
    //save - означает полную информацию, геометрия и пр
    this.getJSON = function (save) {
        var json = {name: this.name, description: this.description};
        json.fields = this.fields.map(function (item) {
            return item.getJSON();
        });
        if (save) {
            json.geometry = _.pick(this.geometry, 'x', 'y');
        }
        return json;
    };
}
