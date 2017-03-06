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
  gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(DEST_DIR + 'js/'));
});

gulp.task('watch', ['sass', 'js', 'html'], function() {
  gulp.watch('*.html', ['html']);
  gulp.watch('css/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['js']);
});


/*********** CSS ***********/
gulp.task('cssLib', [], function() {
    gulp.src('app/css/images/**/*') 
        .pipe(gulp.dest('dist/css/images'));

    gulp.src('app/css/libs/chartist/chartist.min.css')
        .pipe(gulp.dest('dist/css'));

    gulp.src('app/css/libs/animate/animate.min.css')
        .pipe(gulp.dest('dist/css'));

    gulp.src('bower_components/Swiper/dist/css/swiper.min.css')
        .pipe(gulp.dest('dist/css'));

    return gulp.src(['app/css/global.css', 'app/css/ionicons.css']) 
        .pipe(minifyCSS())
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest('dist/css')); 
});

/*********** JavaScript ***********/
gulp.task('jsApp', [], function() {
    gulp.src(source.js.stockpool)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist/stockpool/js'));

    gulp.src(source.js['stockpool-v2'])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/stockpool-v2/js'));

    gulp.src(source.js.discovery)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist/discovery/js'));

    gulp.src(source.js.forecast)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist/forecast/js'));

    gulp.src(source.js['forecast-v2'])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/forecast-v2/js'));

    gulp.src(source.js.hot)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist/hot/js'));

    gulp.src(source.js.download)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist/download/js'));
});

gulp.task('lint', function () {
  return gulp
    .src([source.js.stockpool, source.js['stockpool-v2'], source.js.discovery, source.js.forecast, source.js['forecast-v2'], source.js.hot, source.js.download].join(",").split(","))
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
gulp.task('build', ['html', 'sass', 'js'], function(){
  console.log('complete');
});
