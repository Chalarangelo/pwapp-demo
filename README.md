# Progressive Web App Demo

A very simple progressive web app demo that will help you get started. Below you can find a quick rundown of what the demo does. The resulting progressive web app can be found [here](https://chalarangelo.github.io/pwapp-demo/).

## index.html

A very straightforward HTML page, stylized using my very own [mini.css framework](https://github.com/Chalarangelo/mini.css). It contains some simple controls for the user to interact with and some dummy elements to print results and status messages.

One point of interest in this file is the manifest declaration, which looks something like this:

```
<link rel="manifest" href="./manifest.json">
```

## js/app.js

A simple piece of Javascript code to test the functionality of the progressive web app. We send requests to the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), based on the user's input and retrieve some sample data.

Note that inside the document's loading event, we added the following code:

```
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('./service-worker.js')
		.then(function() { console.log('Registered service worker!'); });
}
```

This code registers the progressive web app's service worker.

## manifest.json

The manifest of the progressive web app looks something like this:

```
{
 	"name": "Progressive Web App Demo",
	"short_name": "PWA Demo",
	"icons": [{
		"src": "./icons/pwa-256x256.png",
		"sizes": "256x256",
		"type": "image/png"
		}],
	"start_url": "./index.html",
	"display": "standalone",
	"background_color": "#c62828",
	"theme_color": "#b71c1c"
}
```

In this file we define the human-readable `name` and `short_name` descriptors for our progressive web app, the `icons` array for the set of images that will serve as the progressive web app's icon set (we only have one in this demo), the `start_url` for our application, `display` mode and the color scheme via `background_color` and `theme_color`.

You can find more information on the structure of the progressive web app's manifest [here](https://w3c.github.io/manifest/).

## service-worker.js

Last, but not least, the service worker is what makes a progressive web app what it is. We first define a name for the cache to use and what resources to be cached, like this:

```
var cacheName = 'demoPWA-v1';
var filesToCache = [
	'./',
	'./index.html',
	'./js/app.js',
	'./icons/pwa-256x256.png'
];
```

Then, we deal with the various events. `install` comes first and it's the event that's fired when you first visit the page. What we want to do in our `install` event is cache the progressive web app's shell. We achieve this using the following code:

```
self.addEventListener('install', function(e) {
	console.log('[demoPWA - ServiceWorker] Install event fired.');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[demoPWA - ServiceWorker] Caching app shell...');
			return cache.addAll(filesToCache);
		})
	);
});
```

Now, for the `activate` event, we want to deal with updating the cache, as necessary. To do this, we used the code below:

```
self.addEventListener('activate', function(e) {
	console.log('[demoPWA - ServiceWorker] Activate event fired.');
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
	return self.clients.claim();
});
```

Finally, we deal with the `fetch` event, which is fired whenever we send a request from our page. What we want to do is check if we have the resource cached and try to serve it from the cache, otherwise we will fetch the resource from the URL, as normal. We also added some error handling at the end to deal with certain requests that returned errors when offline. After all of that, we eneded up with the following code:

```
self.addEventListener('fetch', function(e) {
	console.log('[demoPWA - ServiceWorker] Fetch event fired.', e.request.url);
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
});
```

---

## Resources and tutorials

- [Your first progressive web app](https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/)
- [A beginner's guide to progressive web apps](https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/)
- [Web app manifest](https://w3c.github.io/manifest/)
- [Service workers](https://www.w3.org/TR/service-workers/)

## License

This project is licensed under the MIT license.
