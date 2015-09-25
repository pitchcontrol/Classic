/**
 * Created by snekrasov on 24.04.2015.
 */
"use strict";
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var gulp = require('gulp');
//var concat = require('gulp-concat');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
//Очистка папки
let rimraf = require('rimraf');
//Минификация js
var uglify = require('gulp-uglify');
var jasmine = require('gulp-jasmine');
var filelog = require('gulp-filelog');


var src = ['./app/css/site.css',
    './app/app.js',
    './app/directives/*.js',
    './app/controllers/*.js',
    './app/services/*.js',
    './app/Primitives/*.js',
    './app/filters/*.js',
    './app/factories/*.js'];

//Все тесты
gulp.task('jasmine', function () {
    return gulp.src('server/spec/**/*.spec.js')
        //return gulp.src('server/spec/csharp/*.spec.js')
        .pipe(jasmine({includeStackTrace: true}));
});
//gulp.task('jasmin-matches-test', function () {
//    return gulp.src('server/spec/Test.jasmine.spec.js')
//        .pipe(jasmine({includeStackTrace: true}));
//});
//gulp.task('bootstrap-form-test', function () {
//    return gulp.src('server/spec/html/bootstrap-form.spec.js')
//        .pipe(jasmine({includeStackTrace: true}));
//});
//gulp.task('form-test', function () {
//    return gulp.src('server/spec/html/form.spec.js')
//        .pipe(jasmine({includeStackTrace: true}));
//});
//gulp.task('boilerplateBuilder-test', function () {
//    return gulp.src('server/spec/boilerplateBuilder.spec.js')
//        .pipe(jasmine({includeStackTrace: true}));
//});
//gulp.task('Класс-test', function () {
//    return gulp.src('server/spec/csharp/Класс.spec.js')
//        .pipe(jasmine({includeStackTrace: true}));
//});

var templateCache = require('gulp-angular-templatecache');

gulp.task('build:template', function () {
    gulp.src('./app/views/*.html')
        .pipe(templateCache({root: "view", module: "app"}))
        .pipe(gulp.dest('dist'));
});


//Собираем bower
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({directory: "./bower_components"}))
        .pipe(gulp.dest('./app'));
    //Внедряе пакеты в конф файл karma
    gulp.src('./karma.conf.js')
        .pipe(wiredep({
            directory: "./bower_components",
            devDependencies: true,
            fileTypes: {
                js: {
                    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                    detect: {
                        js: /['\']([^'\']+\.js)['\'],?/gi
                    },
                    replace: {
                        js: '"{{filePath}}",'
                    }
                }
            }
        }))
        .pipe(gulp.dest('./'));

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
//============================ Сборка ============================
//Очистка - удаляет папку
gulp.task('build:clean', function (cb) {
    rimraf('./dist/', cb);
    //gulp.src('./dist/', {read: false})
    //    .pipe(clean());
});

//Копирует бутсраповские шрифты
gulp.task('fonts', function () {
    gulp.src(['./**/dist/fonts/*.{ttf,woff,woff2,eof,svg}'])
        //Удаляется структура папок и все валятся в одну
        .pipe(flatten())
        .pipe(gulp.dest('dist/fonts'));
});

//Основная сборка, на основе файла index.html
gulp.task('build', ['build:clean'], function () {
    var assets = useref.assets();

    return gulp.src('./app/index.html')
        .pipe(assets)
        .pipe(filelog())
        .pipe(gulpif('*.js', uglify()))
        //processImport - игонорировать @import
        .pipe(gulpif('*.css', minifyCss({processImport: false})))
        .pipe(assets.restore())
        //Вырезает блоки коментариев
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});
gulp.task('default', ['develop', 'watch', 'bower', 'bowerWatch']);