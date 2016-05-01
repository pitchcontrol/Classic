/**
 * Created by snekrasov on 24.04.2015.
 */
"use strict";
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var fs =require('fs');
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
var minifyHTML = require('gulp-minify-html');
//Работа SFTP
var GulpSSH = require('gulp-ssh');

var src = ['./app/css/site.css',
    './app/css/theme.css',
    './app/app.js',
    './app/directives/*.js',
    './app/controllers/*.js',
    './app/services/*.js',
    './app/Primitives/*.js',
    './app/filters/*.js',
    './app/setup/*.js',
    './app/factories/*.js'];

//Все тесты backend
gulp.task('jasmine-backend', function () {
    return gulp.src('server/spec/**/*.spec.js')
        //return gulp.src('server/spec/csharp/*.spec.js')
        .pipe(jasmine({includeStackTrace: true, verbose: true}));
});
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
    var sources = gulp.src(src, {read: true});
    return gulp.src('./app/index.html')
        .pipe(inject(sources, {relative: false, addPrefix: "..", addRootSlash: false}))
        .pipe(gulp.dest('./dist'))
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
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./app/index.html')
        .pipe(inject(svgs, {transform: fileContents}))
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


var templateCache = require('gulp-angular-templatecache');

//Подключаем шаблоны ангуляра
gulp.task('build:template', function () {
    return gulp.src('./app/views/*.html')
        .pipe(minifyHTML({quotes: true}))
        .pipe(templateCache({root: "views", module: "app", filename: "templates.js"}))
        .pipe(gulp.dest('dist/scripts'))
        .on('error', log);
});
//Копируем иконки
gulp.task('build:copy image', ()=> {
    return gulp.src(['./app/image/*.svg', './app/image/*.ico']).pipe(gulp.dest('dist/image'))
});

gulp.task('build:frontend', function (callback) {
    runSequence('build:clean', ['builds:fonts', 'build:main', 'build:copy image', 'build:vendor'], 'build:inject-direct',
        callback);
});
var config = {
    host: '88.212.220.114',
    port: 22,
    username: 'nodeuser',
    privateKey: fs.readFileSync('./id__rsa.key'),
    passphrase:'rsa100'
};

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
});
//Выкладываем frontend
gulp.task('copy:frontend', function () {
    return gulp
        .src(['./dist/**/*.*'])
        .pipe(gulpSSH.dest('/var/www/classic.ru/html/dist'));
});
//Выкладываем backend
gulp.task('copy:backend', function () {
    return gulp
        .src(['./server/**/*.*', '!**/spec/**', '!config.json'])
        .pipe(gulpSSH.dest('/var/www/classic.ru/html/server'));
});


gulp.task('build:main', ['build:template'], ()=> {
    var jsFilter = gulpFilter('**/*.js', {restore: true});  //отбираем только  javascript файлы
    var cssFilter = gulpFilter('**/*.css');  //отбираем только css файлы
    src.push('./dist/scripts/templates.js');
    return gulp.src(src)
        // собираем js файлы , склеиваем и отправляем в нужную папку
        .pipe(jsFilter)
        .pipe(concat('main.min.js'))
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(jsFilter.restore)
        // собраем css файлы, склеиваем и отправляем их под синтаксисом css
        .pipe(cssFilter)
        .pipe(concat('main.min.css'))
        //processImport - игонорировать @import
        .pipe(minifyCss({processImport: false}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build:vendor', ()=> {
    var jsFilter = gulpFilter('**/*.js', {restore: true});  //отбираем только  javascript файлы
    var cssFilter = gulpFilter('**/*.css');  //отбираем только css файлы
    return gulp.src(mainBowerFiles())
        // собираем js файлы , склеиваем и отправляем в нужную папку
        .pipe(jsFilter)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(jsFilter.restore)
        // собраем css файлы, склеиваем и отправляем их под синтаксисом css
        .pipe(cssFilter)
        .pipe(concat('vendor.min.css'))
        //processImport - игонорировать @import
        .pipe(minifyCss({processImport: false}))
        .pipe(gulp.dest('dist/css'));
});
//Внедряем скрипты шабоны
gulp.task('build:inject-direct', function () {
    var sources = gulp.src(['./dist/scripts/vendor.min.js', './dist/scripts/main.min.js', './dist/css/vendor.min.css', './dist/css/main.min.css'], {read: true});
    return gulp.src('./app/index.html')
        .pipe(inject(sources, {
            relative: false,
            addPrefix: "..",
            addRootSlash: false,
            removeTags: true,
            name: 'release'
        }))
        .pipe(gulp.dest('./dist'))
        .on('error', log);
});
