var cacheName = 'demoPWA-v1';
var filesToCache = [
	'./',
	'./index.html',
	'./js/app.js',
	'./icons/pwa-256x256.png'
];

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[demoPWA - ServiceWorker] Caching app shell...');
			return cache.addAll(filesToCache).then(function() {
				self.skipWaiting();
			});
		})
	);
	console.log('[demoPWA - ServiceWorker] Install event fired.');
});

self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[demoPWA - ServiceWorker] Removing old cache...', key);
					return caches.delete(key);
				}
			}));
		})
	);
	console.log('[demoPWA - ServiceWorker] Activate event fired.');
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	e.respondWith(
		caches.match(e.request).then(function(response) {
			if (response) {
				console.log('[demoPWA - ServiceWorker] Retrieving from cache...');
				return response;
			}
			console.log('[demoPWA - ServiceWorker] Retrieving from URL...');
			return fetch(e.request).catch(function(e){
				console.log('[demoPWA - ServiceWorker] Fetch request failed!');
			});
		})
	);
	console.log('[demoPWA - ServiceWorker] Fetch event fired.', e.request.url);
});
