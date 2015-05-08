/**
 * Created by snekrasov on 30.04.2015.
 */
function Entity(diagramService) {
    "use strict"
    var self = this;
    //Колекция сущностей
    this.diagramService = diagramService;
    var _name = "entity";
    this.fields = [];
    //Текущее выбранное поле
    this.currentField = null;
    //Счетчик для номера поля по умолчанию
    var _count = 0;
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
    this.addField = function () {
        var fl = new Field(this);
        fl.name = "field" + _count;
        this.fields.push(fl);
        _count++;
        return fl;
    };
    this.removeField = function () {
        var index;
        if (this.currentField) {
            if (this.currentField.association) {
                index = diagramService.associations.indexOf(this.currentField.association);
                diagramService.associations.splice(index, 1);
            }
            index = this.fields.indexOf(this.currentField);
            this.fields.splice(index, 1);
            this.currentField = null;

        }
    };
}
