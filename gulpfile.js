const gulp  = require('gulp'),
      babel = require('gulp-babel'),
      minify = require('gulp-minify');

gulp.task('js', function (){
    return gulp.src('src/countdowntimer.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
    return gulp.src('dist/countdowntimer.js')
      .pipe(minify())
      .pipe(gulp.dest('dist'))
});