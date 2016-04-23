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
    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            if (_.findWhere(diagramService.entities, {name: value}) == undefined) {
                _name = value;
            } else {
                this.error = value + ', уже есть';
            }
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
            //Если тут ассоциация то надо найти сущность и выставить
            //планирование
            if (fl.type == 'Association') {
                var fEntity = diagramService.findEntity(field.associationObj.start.name);
                this.diagramService.shedule.push({field: fl, entity: fEntity} )
            }
            //Если тут enum то надо найти enum и выставить ссылку
            if(fl.type == 'enum'){
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
            };
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
        var json = {name: this.name};
        json.fields = this.fields.map(function (item) {
            return item.getJSON();
        });
        if (save) {
            json.geometry = _.pick(this.geometry, 'x', 'y');
        }
        return json;
    };
}
