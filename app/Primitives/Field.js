/**
 * Created by snekrasov on 30.04.2015.
 */
function Field(entity) {
    "use strict";
    //Сущность родитель
    this.entity = entity;
    //Тип поля
    var _type = "string";
    //Обязательность
    this.isRequired = true;
    //Ссылка ассоциация на другую сущность
    this.associationObj = null;
    var _name = "new";
    //Ссылка на ассоциацию нужна для котрола
    var _reference = null;
    //Будет подсвечивать в случаи выбора
    this.selected = false;
    //Будем проверять тип, если заданна связь валидировать ее и создавть
    var setAssociation = function () {
        entity.error = _type == "Association" && !this.association ? 'выбран тип ассоциация но связь не заданна.' : null;
    };
    this.select = function () {
        this.selected = true;
        var field = this.entity.currentField;
        if (field && field != this) {
            field.selected = false;
        }
        this.entity.currentField = this;
    };
    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            if (_.findWhere(entity.fields, {name: value}) == undefined) {
                _name = value;
                entity.error = null;
            } else {
                entity.error = value + ', уже есть';
            }
        }
    });
    Object.defineProperty(this, 'type', {
        get: function () {
            return _type;
        },
        set: function (value) {
            //Если до этого был тип ассоциация, то при смене типа надо разрушить связь
            if (_type == "Association" && value != "Association") {
                this.association = null;
            }
            _type = value;
            setAssociation.bind(this)();
        }
    });
    //Object.defineProperty(this, 'associationObj', {
    //    get: function () {
    //        return associationObj;
    //    }
    //});
    Object.defineProperty(this, 'association', {
        get: function () {
            return _reference;
        },
        set: function (value) {
            _reference = value;
            //Если тут будет null то бахаем связь
            if (!value) {
                if (this.associationObj)
                    this.associationObj.start.outerAssociation.remove(this.associationObj);
                entity.diagramService.associations.remove(this.associationObj);
                this.associationObj = null;
            }
            else {
                //Сюда передается ссылка на сущность, нужно создать связь
                //Если ссылка таже самая ни чего не создаем, если другая то нужно удалить ссылку
                if (this.associationObj) {
                    this.associationObj.start.outerAssociation.remove(this.associationObj);
                    entity.diagramService.associations.remove(this.associationObj);
                }
                var r = new Relation();
                if (value.geometry) {
                    //Нужно сразу задать окончание связи
                    r.setStart(value.geometry.bottom.x, value.geometry.bottom.y);
                }
                if (this.geometry) {
                    //И начало
                    r.setEnd(this.geometry.right.x, this.geometry.right.y);
                }
                var ass = {
                    start: value,
                    end: this,
                    many: false,
                    toString: function () {
                        return this.end.entity.name + '_' + this.end.name + (this.many ? '(*)' : '') + '_' + this.start.name;
                    },
                    relation: r
                };
                //ДОбавляем у внешней сущности в колекцию
                value.outerAssociation.push(ass);
                this.associationObj = ass;
                entity.diagramService.associations.push(ass);
                //Подвязываем события
            }
            setAssociation.bind(this)();
        }
    });
    this.toString = function () {
        return this.name + ': ' + this.type;
    };
    this.getJSON = function () {
        var json = {
            type: this.type, name: this.name, isRequired: this.isRequired
        };
        if (this.associationObj) {
            json.associationObj = {
                start: {name: this.associationObj.start.name}
            };
        }
        return json;
    };
}
