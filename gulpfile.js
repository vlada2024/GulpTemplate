const {src, dest, watch, parallel, series}  = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function prepareScripts(){
    return src(['app/js/*.js', '!app/js/main.min.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function prepareStyles() {
    return src('app/scss/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function observe(){
    watch(['app/scss/style.scss'], prepareStyles)
    watch(['app/js/*.js', '!app/js/main.min.js'], prepareScripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

function browserRefresh(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist(){
    return src('dist/*')
    .pipe(clean())
}

 
function build(){
    return src([
        'app/css/style.min.css',
        'app/js/*.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = prepareStyles;
exports.scripts = prepareScripts;
exports.observe = observe;
exports.browser = browserRefresh;
exports.clean = cleanDist;

exports.build = series(cleanDist, build);
exports.default = series(prepareStyles, prepareScripts, browserRefresh, observe);