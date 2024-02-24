// Gulp.js configuration
// npm install --save-dev gulp-cli gulp gulp-dart-sass node-sass gulp-clean-css gulp-uglify  gulp-plumber gulp-autoprefixer gulp-zip

const fs = require('fs');
const gulp = require('gulp');
var babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-dart-sass');
const minifycss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

sass.compiler = require('node-sass');

gulp.task('css', function () {
    return gulp
        .src('src/main/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/ttts'));
});

gulp.task('js', function () {
    return gulp
        .src('src/main/core/*.js')
        .pipe(plumber())
        .pipe(
            babel({
                presets: ['@babel/preset-env'],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('dist/ttts/core'));
});

gulp.task('profile', function () {
    return gulp.src(['src/profile/**/*.js']).pipe(plumber()).pipe(gulp.dest('dist/profiles'));
});

gulp.task('support', function () {
    return gulp.src(['src/main/*.js']).pipe(plumber()).pipe(gulp.dest('dist/ttts/'));
});

gulp.task('media', function () {
    return gulp.src('src/media/**').pipe(plumber()).pipe(gulp.dest('dist/ttts/media'));
});

const dists = [
    { task: 'twee', name: 'creator-twee' },
    { task: 'twine', name: 'creator-twine' },
    { task: 'developer', name: 'developer' },
    { task: 'gamer', name: 'gamer' },
    { task: 'profiles', name: 'profiles' },
];
const distTasks = [];
dists.map((dist) => {
    gulp.task('zip-' + dist.task, function () {
        return gulp
            .src('dist/' + dist.name + '/**')
            .pipe(plumber())
            .pipe(zip('ttts-' + dist.name + '.zip'))
            .pipe(gulp.dest('dist/downloads'));
    });
    distTasks.push('zip-' + dist.task);
});

// gulp.task('zip', function () {
//     return gulp.src('dist/*/**').pipe(plumber()).pipe(zip('ttts.zip')).pipe(gulp.dest('dist'));
// });

gulp.task('zip', gulp.series(distTasks));

gulp.task('wrapper-main', function () {
    var coreJs = fs.readFileSync('dist/ttts/core/ttts.js', 'utf8');
    var coreCss = fs.readFileSync('dist/ttts/core/ttts-style.css', 'utf8');

    return gulp
        .src('src/wrapper/**/*')
        .pipe(plumber())
        .pipe(replace('INSERT_TTTS_CORE_HERE', coreJs))
        .pipe(replace('INSERT_TTTS_STYLE_HERE', coreCss))
        .pipe(gulp.dest('dist'));
});

gulp.task('wrapper-game', function () {
    return gulp.src('dist/ttts/**/*').pipe(plumber()).pipe(gulp.dest('dist/gamer'));
});

gulp.task('wrapper-support', function () {
    return gulp
        .src('dist/ttts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/creator-twee/ttts'))
        .pipe(gulp.dest('dist/creator-twine/ttts'))
        .pipe(gulp.dest('dist/gamer/ttts'))
        .pipe(gulp.dest('dist/developer/ttts'));
});

gulp.task('wrapper-developer', function () {
    return gulp
        .src('src/main/core/ttts.js')
        .pipe(plumber())
        .pipe(
            babel({
                presets: ['@babel/preset-env'],
            })
        )
        .pipe(gulp.dest('dist/developer'));
});

gulp.task('wrapper', gulp.series('wrapper-support', 'wrapper-main', 'wrapper-developer'));

gulp.task('docs', function () {
    return gulp.src('dist/gamer/**/*').pipe(plumber()).pipe(gulp.dest('docs/demo'));
});

gulp.task('build', gulp.series('css', 'js', 'wrapper', 'docs'));
gulp.task('export', gulp.series('support', 'media', 'build', 'profile', 'zip'));

gulp.task('watch', function () {
    gulp.watch('src/**/*.scss', gulp.series('css'));
    gulp.watch('src/**/*.js', gulp.series('js'));
    gulp.watch(['src/profile/*.js'], gulp.series('profile'));
    gulp.watch(['*.md', 'src/**/*.bat', 'src/**/*.py', 'src/*.js'], gulp.series('support'));
});
