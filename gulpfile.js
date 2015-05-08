/**
 * Created by snekrasov on 24.04.2015.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
//Пакет объденяет контактинацию и минификацию
var uglify = require('gulp-uglifyjs');

var src = ['./app/app.js', './app/controllers/*.js', './app/services/*.js', './app/Primitives/*.js'];

//Собираем bower
gulp.task("bower", function () {
    var lessRegEx = (/.*\.js$/i);
    return gulp.src(mainBowerFiles({filter: lessRegEx}))
        .pipe(uglify('bower.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist/'));
});
//Собираем файлы
gulp.task('default', function () {
    gulp.src(src)
        .pipe(uglify('build.min.js', {
            outSourceMap: true
        })).on('error', gutil.log)
        .pipe(gulp.dest('./dist'));
});
gulp.task('watch', function () {
    //gulp.watch(src, function (event) {
    //    gulp.run('default');
    //})
    gulp.watch(src, ['default']);
});

