const {src, dest, watch, parallel, series}  = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const uglifycss = require('gulp-uglifycss');

function prepareScripts(){
    return src([
        'app/js/*.js', 
        '!app/js/main.min.js',
        '!app/js/jquery.min.js',
        '!app/js/slick.min.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function prepareStyles() {
    return src('app/scss/*.scss', {base: 'app/scss'})
    .pipe(rename({extname: ".css"}))
    .pipe(scss())
    .pipe(dest('app/css'))
}

function prepareStylesWithCompress() {
    return src('app/scss/*.scss', {base: 'app/scss'})
    .pipe(rename({extname: ".min.css"}))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function prepareStylesCompressOnly() {
    return src('app/css/slick.css')
    .pipe(rename({extname: ".min.css"}))
    .pipe(uglifycss())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}



function observe(){
    watch(['app/scss/*.scss'], prepareStylesWithCompress)
    watch(['app/scss/*.scss'], prepareStyles)
    watch([
        'app/js/*.js', 
        '!app/js/main.min.js',
        '!app/js/jquery.min.js',
        '!app/js/slick.min.js'
    ], prepareScripts)
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
        'app/css/*.min.css',
        'app/js/*.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = series(prepareStyles, prepareStylesWithCompress, prepareStylesCompressOnly);
exports.scripts = prepareScripts;
exports.observe = observe;
exports.browser = browserRefresh;
exports.clean = cleanDist;

exports.build = series(cleanDist, build);
exports.default = series(prepareStyles, prepareStylesWithCompress, prepareStylesCompressOnly, prepareScripts, parallel(observe, browserRefresh));



