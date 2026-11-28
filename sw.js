/* AirNavFLOW service worker
   - App shell: cache-first (works offline after first visit)
   - Pages: network-first, falls back to cached shell when offline
   - Province borders / fonts: stale-while-revalidate
   - lib/ (pdf.js, 1.4 MB): fetched once into its own cache, kept across app versions
   - map/*.pmtiles is NOT handled here: the app stores it in its own cache ('fp-offline-map-v1') */
var APP_CACHE='fp-app-v192';
var RUNTIME_CACHE='fp-runtime-v1';
var LIB_CACHE='fp-lib-v1';   /* rename when a file in lib/ is replaced */
var LIB=['lib/pdf.min.js','lib/pdf.worker.min.js'];
var SHELL=['./'];
var OPTIONAL=['index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/sqn201.png','icons/slide-bg.jpg'];
var RUNTIME_HOSTS=['cdn.jsdelivr.net','raw.githubusercontent.com','fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(APP_CACHE).then(function(c){
    return c.addAll(SHELL).then(function(){
      return Promise.all(OPTIONAL.map(function(u){return c.add(u).catch(function(){});}));
    });
  }).then(function(){
    return caches.open(LIB_CACHE).then(function(c){
      return Promise.all(LIB.map(function(u){return c.match(u).then(function(hit){return hit||c.add(u);}).catch(function(){});}));
    }).catch(function(){});
  }).then(function(){return self.skipWaiting();}));
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){
      return (k.indexOf('fp-app-')===0&&k!==APP_CACHE)||(k.indexOf('fp-runtime-')===0&&k!==RUNTIME_CACHE)||(k.indexOf('fp-lib-')===0&&k!==LIB_CACHE);
    }).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);

  if(url.origin===self.location.origin){
    if(/\.pmtiles$/i.test(url.pathname))return;
    if(/\/notam\//.test(url.pathname))return;   // daily NOTAM file: always from network (app keeps its own offline copy)
    if(/\/data\//.test(url.pathname))return;    // data/*.txt (มทบ., CSAR, ผบ.ฝูง): same, app keeps its own offline copy
    if(/\/DataBase\/CoWork\//.test(url.pathname))return;   // shared AD/RWY/สนามบิน ทบ. + places.json (DataBase repo): app keeps its own offline copy
    if(/\/DataBase\/AirNavFlow\/charts\//.test(url.pathname))return;   // built-in charts: app checks size vs index.json, keeps its own offline copy (fp-charts-db-v1)
    if(req.mode==='navigate'){
      e.respondWith(fetch(req).then(function(res){
        if(res.ok&&/(\/|index\.html)$/.test(url.pathname)){   /* never store an error page (404 / 5xx) as the offline app shell */
          var copy=res.clone();
          caches.open(APP_CACHE).then(function(c){c.put('./',copy);if(/index\.html$/.test(url.pathname))c.put(req,res.clone());});
        }
        return res;
      }).catch(function(){return caches.match('./').then(function(hit){return hit||caches.match(req,{ignoreSearch:true});});}));
      return;
    }
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(function(hit){return hit||fetch(req);}));
    return;
  }

  if(RUNTIME_HOSTS.indexOf(url.hostname)!==-1){
    e.respondWith(caches.open(RUNTIME_CACHE).then(function(c){
      return c.match(req).then(function(hit){
        var net=fetch(req).then(function(res){if(res&&(res.ok||res.type==='opaque'))c.put(req,res.clone());return res;});
        if(hit){e.waitUntil(net.catch(function(){}));return hit;}   /* refresh in the background; offline is not an error */
        return net;
      });
    }));
  }
});
