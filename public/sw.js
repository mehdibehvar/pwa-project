self.addEventListener("install",function (event) {
    console.log("service worker sugest installing...",event);
    // self.skipWaiting();
})
self.addEventListener("activate",function (event) {
    console.log("service worker is activated",event);
})
self.addEventListener("fetch",function (event) {
    console.log("service worker is fetching...",event);
})





