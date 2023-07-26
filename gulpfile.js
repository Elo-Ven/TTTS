// Gulp.js configuration
// npm install --save-dev gulp-cli gulp gulp-dart-sass node-sass gulp-clean-css gulp-uglify  gulp-plumber gulp-autoprefixer gulp-zip

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-dart-sass');
const minifycss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

sass.compiler = require('node-sass');

gulp.task('css', function () {
    return gulp
        .src('src/core/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/ttts/core'))
        .pipe(gulp.dest('demo/ttts/core'));
});

gulp.task('js', function () {
    return gulp
        .src('src/core/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('dist/ttts/core'))
        .pipe(gulp.dest('demo/ttts/core'));
});

gulp.task('profile', function () {
    return gulp.src(['src/profile/*.js']).pipe(plumber()).pipe(gulp.dest('dist/profile'));
});

gulp.task('support', function () {
    return gulp
        .src(['*.md', 'src/**/*.bat', 'src/**/*.py', 'src/*.js'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/ttts'))
        .pipe(gulp.dest('demo/ttts'));
});

gulp.task('media', function () {
    return gulp
        .src('src/media/**')
        .pipe(plumber())
        .pipe(gulp.dest('dist/ttts/media'))
        .pipe(gulp.dest('demo/ttts/media'));
});

gulp.task('zip', function () {
    return gulp.src('dist/*/**').pipe(plumber()).pipe(zip('ttts.zip')).pipe(gulp.dest('dist'));
});

gulp.task('export', gulp.series('css', 'js', 'profile', 'support', 'media', 'zip'));

gulp.task('watch', function () {
    gulp.watch('src/**/*.scss', gulp.series('css'));
    gulp.watch('src/**/*.js', gulp.series('js'));
    gulp.watch(['src/profile/*.js'], gulp.series('profile'));
    gulp.watch(['*.md', 'src/**/*.bat', 'src/**/*.py', 'src/*.js'], gulp.series('support'));
});
