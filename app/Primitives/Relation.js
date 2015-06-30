/**
 * Created by snekrasov on 13.05.2015.
 */
//функция связи
function Relation() {
    //Интервал через который линия ломается
    var int = 20;
    var ln = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    var xi = 0, yi = 1;
    //Куда заходит связь справа
    this.setEnd = function (x, y) {

        //Первая точка
        ln[0][xi] = x;
        ln[0][yi] = y;
        redaraw();
    };
    function redaraw() {
        var h = ln[0][yi] + ln[4][yi];
        var center = ( ln[4][xi] - ln[0][xi] ) / 2;
        //Сдучай когда родитель выше и правее
        if ((ln[4][yi] < ln[0][yi] + int) && (ln[4][xi] > ln[0][xi])) {
            ln[2][yi] = ln[3][yi] = ln[0][yi];
        } else
        //родитель выше и левее
        if ((ln[4][yi] < ln[0][yi] + int) && (ln[4][xi] < ln[0][xi])) {
            ln[2][yi] = ln[4][yi] + int;
            ln[2][xi] = ln[0][yi] + int;
            ln[3][yi] = ln[4][yi] + int;
            //излом будет не на центре
            center = int;
        } else
        //родитель ниже и левее
        if (ln[4][xi] < ln[0][xi] && ln[4][yi] > ln[0][yi]) {
            ln[1][xi] = ln[0][xi] + int;
            ln[1][yi] = ln[0][yi];

            ln[3][xi] = ln[4][xi];
            ln[3][yi] = ln[4][yi] + int;

            ln[2][xi] = ln[1][xi];
            ln[2][yi] = ln[3][yi];

            //излом будет не на центре
            center = int;
        }
        else {
            ln[2][yi] = ln[3][yi] = ln[4][yi] + int;
        }

        //Предпоследняя точка
        ln[3][xi] = ln[4][xi];
        ln[1][xi] = center + ln[0][xi];
        ln[1][yi] = ln[0][yi];
        ln[2][xi] = center + ln[0][xi];
    }

    //Откуда выходит связь снизу
    this.setStart = function (x, y) {
        //Последня точка
        ln[4][xi] = x;
        ln[4][yi] = y;
        redaraw();
        ////Предпоследняя точка
        //ln[3][xi] = x;
        ////Сдучай когда родитель выше
        //if (ln[4][yi] < ln[0][yi] + int) {
        //    ln[2][yi] = ln[3][yi] = ln[0][yi];
        //} else {
        //    ln[2][yi] = ln[3][yi] = ln[4][yi] + int;
        //}
        //
        //var center = ( ln[4][xi] - ln[0][xi] ) / 2;
        //ln[2][xi] = center + ln[0][xi];
        //
        //ln[1][xi] = center + ln[0][xi];
    };
    this.toString = function () {
        //return ln[0][xi] + ',' + ln[0][yi] + ' ' + ln[1][xi] + ',' + ln[1][yi] + ' ' + ln[2][xi] + ',' + ln[2][yi] + ' ' + ln[3][xi] + ',' + ln[3][yi] + ' ' + ln[4][xi] + ',' + ln[4][yi];
        var map = ln.map(function (item) {
            return item[xi] + ',' + item[yi];
        });
        return map.join(' ');
    };
}