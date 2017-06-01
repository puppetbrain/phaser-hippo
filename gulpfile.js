var isProductionMode = false;

var
  gulp          = require('gulp'),
  clean         = require('gulp-clean'),
  prettyerror   = require('gulp-prettyerror'),
  // Images
  imagemin      = require('gulp-imagemin'),
  // HTML
  newer         = require('gulp-newer'),
  htmlclean     = require('gulp-htmlclean'),
  // CSS
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  autoprefixer  = require('autoprefixer'),
  cssnano       = require('cssnano'),
  // JS
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),

  folder = {
    src: 'src/',
    dist: 'dist/'
  }
;

var browserSync = require('browser-sync').create();

// Clean
gulp.task('clean', function() {
  return gulp.src(folder.dist, {read: false})
    .pipe(clean())
  ;
});

// Images
gulp.task('images', function() {
  let outputFolder = folder.dist + 'images/';

  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(outputFolder))
    .pipe(imagemin({
      optimizationLevel: 5 
    }))
    .pipe(gulp.dest(outputFolder))
  ;
});

// HTML
gulp.task('html', ['images'], function() {
  let
    outputFolder = folder.dist,
    page = gulp.src(folder.src + '**/*.{html,php}')
      .pipe(newer(outputFolder))
  ;

  if (isProductionMode) {
    page = page.pipe(htmlclean());
  }

  return page.pipe(gulp.dest(outputFolder));
});

// CSS
gulp.task('css', ['images'], function() {

  let postCSSOptions = [
    autoprefixer({ browsers: ['last 2 versions', '> 2%'] })
  ];

  if (isProductionMode) {
    postCSSOptions.push(cssnano);
  }

  return gulp.src(folder.src + 'sass/style.scss')
    .pipe(prettyerror())
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCSSOptions))
    .pipe(gulp.dest(folder.dist + 'css/'))
  ;
});

// JS
gulp.task('js', function() {
  let jsbuild = gulp.src([
    folder.src + 'js/phaser.min.js',
    // 'node_modules/build/phaser-ce/build/phaser.min.js',
    folder.src + 'js/main.js',
    folder.src + 'js/test.js'
  ])
    .pipe(prettyerror())
    .pipe(concat('main.js'))
  ;

  if (isProductionMode) {
    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(uglify())
  }

  return jsbuild.pipe(gulp.dest(folder.dist + '/js'));
});

// Reload
gulp.task('reloadImages', ['images'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('reloadHTML', ['html'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('reloadJS', ['js'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('reloadCSS', ['css'], function(done) {
  browserSync.reload();
  done();
});

// Default task
gulp.task('default', ['images', 'html', 'css', 'js'], function() {

  // Browser sync
  browserSync.init({
    server: {
      baseDir: folder.dist
    }
  });

  // Watch
  gulp.watch(folder.src + '**/*', ['reloadImages']);
  gulp.watch(folder.src + '**/*.{html}', ['reloadHTML']);
  gulp.watch(folder.src + 'js/**/*', ['reloadJS']);
  gulp.watch(folder.src + 'sass/**/*', ['reloadCSS']);
});

// Other tasks
gulp.task('clear', ['clean']);