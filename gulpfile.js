/*jshint esversion: 6 */
const gulp = require('gulp');
const workboxBuilder = require('workbox-build');

// Copy files from app to build
gulp.task('copy', () =>
  gulp.src([
    'app/**/*',
  ]).pipe(gulp.dest('build'))
);

// service worker
gulp.task('service-worker', () => {
  return workboxBuilder.injectManifest({
    swSrc: 'app/sw.js',
    swDest: 'build/sw.js',
    globDirectory: 'build',
    globPatterns: [
      '**/*.{html,css,js}',
      'manifest.json',
      'img/touch/*.png'
    ],
    globIgnore: [
      'sw-src.js',
      'workbox-config.js',
      'node_modules/**/*'
    ]
  }).catch(err => {
    console.log(`[ERROR] ` + err);
  });
});

// default task
gulp.task('default', ['copy', 'service-worker']);

// watch task
gulp.task('watch', () => gulp.watch('app/**/*', ['copy', 'service-worker']));
