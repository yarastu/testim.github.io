/*
https://webdesign-master.ru/blog/tools/gulp-4-lesson.html
https://webdesign-master.ru/blog/docs/gulp-documentation.html
*/

const { src, dest, parallel, series, watch }   = require('gulp');
const exec                                     = require('child_process').exec;
const sass                                     = require('gulp-sass')(require('sass'));
const bs                                       = require('browser-sync').create();

function jekyllBuild(done) {
  exec('jekyll build', function (error, stdout, stderr) {
    if (error) {
      console.log(`exec error ${error}`);
      return;
    }
    console.log(`exec stdout ${stdout}`);
    console.log(`exec stderr ${stderr}`);
    done();
  });
}

function styles() {
  return src('scss/main.scss')
  .pipe(sass())
	.pipe(dest('_site/assets/styles/'))
  .pipe(dest('assets/styles/'))
  .pipe(bs.stream());
}

function browserSync() {
  bs.init({
    server: { 
      baseDir: '_site' 
    },
    notify: false
  });
}
  
exports.jekyllBuild         = jekyllBuild;
exports.styles              = styles;
exports.browserSync         = browserSync;

function watcher() {
  watch('scss/**/*.scss', styles);
  watch(['*.html', '_includes/*.html', '_posts/*.md', '_layouts/*.html', '_config.yml', '_data/*yml']).on('change', series(jekyllBuild, bs.reload));
}

exports.watcher             = watcher;
exports.default             = parallel(jekyllBuild, styles, browserSync, watcher);