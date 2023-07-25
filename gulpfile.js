// Gulp.js configuration
// npm install --save-dev gulp-cli gulp gulp-dart-sass node-sass gulp-clean-css gulp-rename gulp-uglify gulp-plumber gulp-autoprefixer

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const sass = require('gulp-dart-sass');
const minifycss = require('gulp-clean-css');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

sass.compiler = require('node-sass');

gulp.task('css', function () {
    return gulp
        .src('src/ttts-style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/ttts'))
        .pipe(gulp.dest('demo/ttts'));
});

gulp.task('js', function () {
    return (
        gulp
            .src('src/*.js')
            .pipe(plumber())

            // .pipe(
            //     babel({
            //         presets: [
            //             [
            //                 '@babel/env',
            //                 {
            //                     modules: false,
            //                 },
            //             ],
            //         ],
            //     })
            // )
            .pipe(uglify())
            .pipe(gulp.dest('dist/ttts'))
            .pipe(gulp.dest('demo/ttts'))
    );
});

gulp.task('zip', function () {
    return gulp.src('dist/*/**').pipe(plumber()).pipe(zip('ttts.zip')).pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.scss', gulp.series('css'));
    gulp.watch('src/**/*.js', gulp.series('js'));
});
