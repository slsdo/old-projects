var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    exec = require('gulp-exec'),
    print = require('gulp-print'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sitemap = require('gulp-sitemap');

/* Generate html */
gulp.task('html', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py html'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate html with extension */
gulp.task('htmlx', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py html -x'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate html pages only */
gulp.task('htmlpg', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py html -p'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate css */
gulp.task('css', function() {
  return gulp.src('./src/css/bamboo.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./dist/src/css'))
    .pipe(print());
});

/* Generate js */
gulp.task('js', ['jsconst'], function() {
  return gulp.src('./')
    .pipe(exec('webpack'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate const js */
gulp.task('jsconst', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py js'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Book */
gulp.task('book', ['book-html', 'book-css'], function() {
  return gulp.src('./src/static/book/*')
    .pipe(gulp.dest('./dist/book/'))
    .pipe(print());
});

/* Generate book html */
gulp.task('book-html', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py book'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate book css */
gulp.task('book-css', function() {
  return gulp.src('./src/css/kara.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename('book.min.css'))
    .pipe(gulp.dest('./dist/src/css'))
    .pipe(print());
});

/* Generate csv */
gulp.task('csv', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py csv'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Generate sql dump */
gulp.task('sql', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py sqldump'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Import from sql */
gulp.task('sqlimport', function() {
  return gulp.src('./build.py')
    .pipe(exec('python build.py sqlimport'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Move static files */
gulp.task('static', function() {
  return gulp.src(['./src/static/**/*', './src/static/.htaccess'])
    .pipe(gulp.dest('./dist/'))
    .pipe(print());
});

/* Generate sitefile from *.html */
gulp.task('sitemap', function() {
  gulp.src('./dist/**/*.html')
    .pipe(sitemap({
      siteUrl: 'http://tmdict.com',
      changefreq: 'monthly',
      priority: 1.0,
      getLoc: function(siteUrl, loc) {
        var url = '';
        if (loc === siteUrl) { url = loc; }
        else if (loc.search('index.html') != -1) url = loc.substr(0, loc.search('index.html'));
        else url = loc.substr(0, loc.lastIndexOf('.')) || loc; // Removes the file extension 
        return url;
      }
    }))
    .pipe(gulp.dest('./dist'));
});

/* Start webpack dev server */
gulp.task('dev', function() {
  return gulp.src('./')
    .pipe(exec('webpack-dev-server'))
    .pipe(exec.reporter())
    .pipe(print());
});

/* Clean up dist */
gulp.task('clean', function() {
  return del('./dist/**');
});

gulp.task('watch', function() {
  gulp.watch('./src/html/**/*.*', ['html', 'book-html']);
  gulp.watch('./src/css/**/*.*', ['css', 'book-css']);
  gulp.watch('./src/js/**/*.*', ['js']);
  gulp.watch('./src/static/**/*.*', ['static']);
});

gulp.task('default', ['html', 'css', 'js', 'static', 'book-html', 'book-css'], function() {
});