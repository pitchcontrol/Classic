/**
 * Created by snekrasov on 24.04.2015.
 */
"use strict";
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var gulp = require('gulp');
var path = require('path');
//var concat = require('gulp-concat');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
//Очистка папки
let rimraf = require('gulp-rimraf');
//Минификация js
var uglify = require('gulp-uglify');
var jasmine = require('gulp-jasmine');
var filelog = require('gulp-filelog');
//для последовательного запуска
var runSequence = require('run-sequence');
var flatten = require('gulp-flatten');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');

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
function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

var templateCache = require('gulp-angular-templatecache');

gulp.task('build:template', function () {
    return gulp.src('./app/views/*.html')
        .pipe(templateCache({root: "views", module: "app"}))
        .pipe(gulp.dest('dist'))
        .on('error', log);
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
//Внедряем скрипты шабоны
gulp.task('build:inject', function () {
    src.push('./dist/templates.js');
    var sources = gulp.src(src, {read: false});
    return gulp.src('./app/index.html')
        .pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./app'))
        .on('error', log);
});


gulp.task('watch', function () {
    gulp.watch(src, ['develop']);
});
//============================ SVG ===============================
//Инжектит в прямо в код
gulp.task('svgstore', function () {
    var svgs = gulp
        .src('./app/image/*.svg')
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./app/index.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('./dist'));
});
//Собирает все svg в один, минифиципует
gulp.task('svgmin', function () {
    return gulp
        .src('./app/image/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('./dist'));
});
//============================ Сборка ============================
//Очистка - удаляет папку
gulp.task('build:clean', function () {
    //rimraf('./dist/', cb);
    return gulp.src('./dist/', {read: false})
        .pipe(rimraf({force: true}))
        .on('error', log);
});

//Копирует бутсраповские шрифты
gulp.task('builds:fonts', function () {
    return gulp.src(['./**/dist/fonts/*.{ttf,woff,woff2,eof,svg}'])
        //Удаляется структура папок и все валятся в одну
        .pipe(flatten())
        .pipe(gulp.dest('dist/fonts'))
        .on('error', log);
});

gulp.task('build', function (callback) {
    runSequence('build:clean', ['builds:fonts','build:template'], 'build:inject', 'build:simply',
        callback);
});
gulp.task('build:simply', function () {
    var assets = useref.assets();

    return gulp.src('./app/index.html')
        .pipe(assets)
        .pipe(filelog())
        .pipe(gulpif('*.js', uglify({outSourceMap: true})))
        //processImport - игонорировать @import
        .pipe(gulpif('*.css', minifyCss({processImport: false})))
        .pipe(assets.restore())
        //Вырезает блоки коментариев
        .pipe(useref())
        .pipe(gulp.dest('dist'))
        .on('error', log);
});

gulp.task('default', ['develop', 'watch', 'bower', 'bowerWatch']);