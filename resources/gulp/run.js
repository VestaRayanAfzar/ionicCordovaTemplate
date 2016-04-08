var path = require('path'),
    gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    root = path.join(__dirname, '../..'),
    clientDirectory = path.join(root, 'www');

gulp.task('default', function () {
    browserSync.init({
        server: {
            baseDir: clientDirectory
        }
    });
    gulp.watch(clientDirectory + '/**/*', function () {
        browserSync.reload();
    });
});
