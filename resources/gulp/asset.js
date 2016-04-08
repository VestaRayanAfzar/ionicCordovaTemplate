var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    imageop = require('gulp-image-optimization');

module.exports = function (dir, setting) {

    gulp.task('asset:template', function () {
        var stream = gulp.src(dir.src + '/app/templates/**/*.html');
        if (setting.production) {
            stream = stream.pipe(htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                keepClosingSlash: true
            }));
        }
        stream.pipe(gulp.dest(dir.build + '/tpl'));
        gulp.src(dir.src + '/index.html')
            .pipe(gulp.dest(dir.build));
    });

    gulp.task('asset:lib', function () {
        var libs = [
            dir.bower + '/jsSHA/src/sha1.js',
            // dir.bower + '/es6-promise/promise.js',
            dir.bower + '/ionic/release/js/ionic.bundle.js'
        ];
        var stream = gulp.src(libs).pipe(concat('lib.js'));
        if (setting.production) {
            stream = stream.pipe(uglify());
        }
        return stream.pipe(gulp.dest(dir.build + '/js/'));
    });

    gulp.task('asset:font', function () {
        return gulp.src([dir.src + '/fonts/*', dir.bower + '/ionic/release/fonts/*'])
            .pipe(gulp.dest(dir.build + '/fonts'));
    });

    gulp.task('asset:image', function () {
        var stream = gulp.src(dir.src + '/images/**/*');
        if (setting.production) {
            stream.pipe(imageop({
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
            }));
        }
        return stream.pipe(gulp.dest(dir.build + '/img'));
    });

    gulp.task('asset:watch', function () {
        gulp.watch([dir.src + '/index.html', dir.src + '/app/templates/**/*.html'], ['asset:template']);
    });

    return {
        watch: ['asset:watch'],
        tasks: ['asset:template', 'asset:lib', 'asset:font', 'asset:image']
    };
};