/**
 * Created by snekrasov on 07.05.2015.
 */
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    while (index != -1) {
        this.splice(index, 1);
        index = this.indexOf(item);
    }
};