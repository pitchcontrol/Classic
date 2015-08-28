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
var jasmine = require('gulp-jasmine');

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
gulp.task('bootstrap-form-test', function () {
    return gulp.src('server/spec/html/bootstrap-form.spec.js')
        .pipe(jasmine({includeStackTrace: true}));
});
gulp.task('boilerplateBuilder-test', function () {
    return gulp.src('server/spec/boilerplateBuilder.spec.js')
        .pipe(jasmine({includeStackTrace: true}));
});

var templateCache = require('gulp-angular-templatecache');

gulp.task('template', function () {
    gulp.src('./app/views/*.html')
        .pipe(templateCache())
        .pipe(gulp.dest('public'));
});


//Собираем bower
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({directory: "./bower_components"}))
        .pipe(gulp.dest('./app'));
    //Внедряе пакеты в конф файл
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
gulp.task('default', ['develop', 'watch', 'bower', 'bowerWatch']);