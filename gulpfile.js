/*jshint esversion: 6 */
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build
const gulp = require('gulp');
const workboxBuild = require('workbox-build');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browswer-sync').create();
const runSequence = require('run-sequence');

// remove all build files
gulp.task('clean-build', () => del.sync('build'));


// Copy the files from app to build
gulp.task('copy-app', () =>
gulp.src([
  'app/*.html',
  'app/css/**/*.css',
  'app/js/**/*.js',
  'app/img/**',
  'app/favicon.ico',
  'app/manifest.json'
], {base: 'app/.'})
  .pipe(gulp.dest('build'))
);

// copy html
gulp.task('copy-html', () =>
  gulp.src('app/*.html')
  .pipe(gulp.dest('build'))
);

// copy css
gulp.task('copy-css', () =>
  gulp.src('app/css/**/*.css')
  .pipe(gulp.dest('build/css'))
);

// copy js
gulp.task('copy-js', () =>
  gulp.src('app/js/**/*.')
  .pipe(gulp.dest('build/js'))
);

// copy images
gulp.task('copy-images', () =>
  gulp.src('app/img/**')
  .pipe(gulp.dest('build/img'))
);

// copy favicon
gulp.task('copy-favicon', () =>
  gulp.src('app/favicon.ico')
  .pipe(gulp.dest('build'))
);

// copy manifest
gulp.task('copy-manifest', () =>
  gulp.src('app/manifest.json')
  .pipe(gulp.dest('build'))
);

// minify css with clean-css
gulp.task('minify-css', () => {
  return gulp.src('app/css/**/*.css')
  .pipe(cleanCSS({debug: true}, (details) => {
    console.log(`${details.name}: ${details.stats.originalSize}`);
    console.log(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  .pipe(gulp.dest('build/css'));
});

// Service-Worker
gulp.task('service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: 'app/sw.js',
    swDest: 'build/sw.js',
    globDirectory: 'build',
    globPatterns: [
      '**\/*.{js,css,html,png}',
      'manifest.json',
      'img/icon/*.png'
    ],
    globIgnores: [
      'sw-src.js',
      'workbox-config.js',
      'node_modules/**/*'
    ]
  }).then(({count, size, warnings}) => {
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  }).catch(err => console.log(` [ERROR] `+ err));
});

// Broswer Sync
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });
});

// Set default
gulp.task('default', callBack => {
  runSequence(
    'clean-build',
    'copy-app',
    'service-worker',
    callBack
  );
});

// Set watch task to update files in the 'app' folder
gulp.task('watch', () => {
  gulp.watch('app/**/*', ['copy', 'service-worker']);
  gulp.watch('app/css/**/*.css', ['copy-css']);
  gulp.watch('app/js/**/*.js', ['copy-js']);
  gulp.watch('app/img/**', ['copy-images']);
  gulp.watch('app/manifest.json', ['copy-manifest']);
});

// Build prod app
gulp.task('build', callBack => {
  runSequence(
    'clean-build',
    [
      'copy-html',
      'copy-js',
      'copy-images',
      'copy-favicon',
      'copy-manifest'
    ],
    'minify-css',
    'service-worker',
    callBack
  );
});
