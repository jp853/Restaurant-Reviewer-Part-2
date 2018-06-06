// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build
const gulp = require('gulp');
const workboxBuild = require('workbox-build');

// Copy the files from app to build
gulp.task('copy', () => gulp.src(['app/**/*']).pipe(gulp.dest('build')));

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

// Set default
gulp.task('default', ['copy', 'service-worker']);

// Set watch task to update files in the 'app' folder
gulp.task('watch', () => gulp.watch('app/**/*', ['copy', 'service-worker']));
