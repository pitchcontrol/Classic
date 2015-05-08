/**
 * Created by snekrasov on 05.05.2015.
 */
function DiagramItem(collection, defaultName) {
    "use strict";
    this.collection = collection || [];
    var _defaultName = defaultName || 'item';
    var _name;
    var _count = 0;
    var _subCollection = [];
    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            if (_.findWhere(_collection, {name: value}) == undefined) {
                _name = value;
                this.error = null;
            } else {
                this.error = value + ', уже есть';
            }
        }
    });
    this.addItem = function (constructor) {
        var item = new constructor(this.collection);
        item.name = _defaultName + _count;
        this.collection.push(item);
        _count++;
        return item;
    }
}