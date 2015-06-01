/**
 * Created by snekrasov on 30.04.2015.
 */
function Entity(diagramService) {
    "use strict"
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
        fl.id = self._integerCounter.getId();

        if (field) {
            fl.prototype = Object.create(field);
            fl.name = field.name;
            fl.type = field.type;
        } else {
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
    this.getJSON = function () {
        var json = {name: this.name};
        json.fields = this.fields.map(function (item) {
            return item.getJSON();
        });
        return json;
    };
}
