/**
 * Created by snekrasov on 24.04.2015.
 */
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
//Пакет объденяет контактинацию и минификацию
var uglify = require('gulp-uglifyjs');

var src = ['./app/css/site.css', './app/app.js', './app/directives/*.js', './app/controllers/*.js', './app/services/*.js', './app/Primitives/*.js'];

//Собираем bower
//gulp.task("bower", function () {
//    var lessRegEx = (/.*\.js$/i);
//    return gulp.src(mainBowerFiles({filter: lessRegEx}))
//        .pipe(uglify('bower.min.js', {
//            outSourceMap: true
//        }))
//        .pipe(gulp.dest('dist/'));
//});
////Собираем файлы
//gulp.task('default', function () {
//    gulp.src(src)
//        .pipe(uglify('build.min.js', {
//            outSourceMap: true
//        })).on('error', gutil.log)
//        .pipe(gulp.dest('./dist'));
//});

//Собираем bower
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({directory: "./bower_components"}))
        .pipe(gulp.dest('./app'));
    //Специально для кармы готовим файл
    var lessRegEx = (/.*\.js$/i);
    gulp.src(mainBowerFiles({filter: lessRegEx}))
        .pipe(uglify('bower.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist/'));
});
//Слушаем изменения файла bower.json
gulp.task('bowerWatch', function () {
    gulp.watch('bower.json', ['bower']);
});
//Внедряем скрипты
gulp.task('develop', function () {
    var sources = gulp.src(src, {read: false});
    gulp.src('./app/index.html')
        .pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./app'));
});
gulp.task('watch', function () {
    gulp.watch(src, ['develop']);
});
gulp.task('default', ['develop', 'watch', 'bower', 'bowerWatch']);