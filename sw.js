const $versi = "1.0.0";
const $caches = [
  ".",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./script.js",
  "./beli.svg",
  "./gopay.svg",
  "./dana.svg",
  "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100;8..144,200;8..144,300;8..144,400;8..144,500;8..144,600;8..144,700;8..144,800;8..144,900;8..144,1000&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css",
  "https://i.postimg.cc/pd23ZhDH/icon.png",
  "https://i.postimg.cc/sX2dVQXc/tri.png",
  "https://i.postimg.cc/3Rq6Ytz8/axis.png",
  "https://i.postimg.cc/hhW57fSN/xl.png"
];

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open($versi).then(cache => {
			return cache.addAll($caches);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
		caches.keys().then(keys => {
		  return Promise.all(keys.filter(key => key !== $versi).map(key => caches.delete(key))
		  )
		})
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(response => {
			return response || fetch(e.request);
		})
	);
});

