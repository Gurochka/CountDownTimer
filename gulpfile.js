const gulp  = require('gulp'),
      babel = require('gulp-babel');

gulp.task('js', function (){
    return gulp.src('src/countdowntimer.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/js'));
});
