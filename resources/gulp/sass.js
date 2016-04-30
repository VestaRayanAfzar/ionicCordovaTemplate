var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postCss = require('gulp-postcss'),
    autoPrefixer = require('autoprefixer'),
    csswring = require('csswring'),
    mqpacker = require('css-mqpacker');

module.exports = function (dir, setting) {

    gulp.task('sass:compile', function () {
        var stream = gulp.src([dir.src + '/scss/app-rtl.scss', dir.src + '/scss/app-ltr.scss']),
            genMap = !setting.production;
        if (genMap) stream = stream.pipe(sourcemaps.init());
        stream = stream.pipe(sass());
        if (genMap) stream = stream.pipe(sourcemaps.write());
        return stream.pipe(gulp.dest(dir.build + '/pre-css'));
    });

    gulp.task('sass:postCss', ['sass:compile'], function () {
        var preprocessors = [autoPrefixer({
            browsers: ['last 2 version',
                'iOS >= 7',
                'Android >= 4',
                'Explorer >= 10',
                'ExplorerMobile >= 11']
        })];
        if (setting.production) {
            preprocessors.push(mqpacker);
            preprocessors.push(csswring);
        }
        return gulp.src(dir.build + '/pre-css/*.css')
            .pipe(postCss(preprocessors))
            .pipe(gulp.dest(dir.build + '/css'))
    });

    gulp.task('sass:watch', function () {
        return gulp.watch(dir.src + '/scss/**/*.scss', ['sass:postCss']);
    });

    return {
        tasks: ['sass:postCss'],
        watch: ['sass:watch']
    };
};