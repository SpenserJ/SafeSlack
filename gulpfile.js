var gulp = require('gulp')
  , sass = require('gulp-sass')
  , sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['scss'], function () {
  gulp.watch('./src/scss/*', ['scss']);
});

gulp.task('scss', function () {
  return gulp.src('./src/scss/style.scss')
             .pipe(sourcemaps.init())
             .pipe(sass().on('error', sass.logError))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('./dist/css'));
});
