// Importing Workbox
// To start using Workbox you just need to import the workbox-sw.js file in your service worker.
// https://developers.google.com/web/tools/workbox/guides/get-started
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}