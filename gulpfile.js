var gulp = require('gulp');                  // gulp插件
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');         // js代码压缩
var minifyCSS = require('gulp-minify-css');  // css代码压缩
var sass = require('gulp-sass');             // sass代码压缩
// var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');     // 图片压缩
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var DEST_DIR='dist/';

gulp.task('clean', function() {
    return del.sync([DEST_DIR + '*'], {
        force: true
    });
});

gulp.task('html', function() {
  var opts = {comments:true, spare:true};
  gulp.src('*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(DEST_DIR));
});

gulp.task('sass', function() {
  gulp.src('css/*.scss')
    .pipe(sass({ style: 'compressed' }))
    // .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(DEST_DIR + 'css/'));
});

gulp.task('js', function() {
  var stream = gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST_DIR + 'js/'));
  return stream
});

gulp.task('sage', ['js'], function() {
  var stream = gulp.src([DEST_DIR + 'js/lib/zepto.min.js', DEST_DIR + 'js/benew_common.js', DEST_DIR + 'js/siri_helper.js', DEST_DIR + 'js/siri.js'])
    // .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest(DEST_DIR + 'js/'));
  return stream;
});

gulp.task('watch', ['sass', 'sage', 'html'], function() {
  gulp.watch('*.html', ['html']);
  gulp.watch('css/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['sage']);
});

gulp.task('lint', function () {
  return gulp.src('js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish, {
      verbose: true
    }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('deploy', function () {
    gulp.src('dist/**/*')
        .pipe(gulp.dest('../benew-mobile/dist/app/'));
});

/*********** HTML + CSS + JavaScript ***********/
gulp.task('build', ['html', 'sass', 'sage'], function(){
  console.log('complete');
});
