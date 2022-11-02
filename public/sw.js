////The ServiceWorker interface is dispatched a set of lifecycle events — install and activate — and functional events including fetch.
const Static_Cache_Version="static8";
const Dynamic_Cache_Version="dynamic6";
const Static_Assets=[
    "/",
    "add.html",
    "index.html",
    "assets/css/style.css",
    "assets/css/libs/material.min.css",
    "manifest.json",
    "assets/js/main.js",
    "assets/js/helpers.js",
    "assets/js/libs/material.min.js",
    "/app.js",
    "/offline.html",
    "assets/images/placeholder.png",
    "https://fonts.googleapis.com/css?family=Roboto:400,700"
];
const preCache=async ()=>{
    const cache=await caches.open(Static_Cache_Version);
    return cache.addAll(Static_Assets);
}
///بهترین جا برای اینکار در ایونت اگتیویت است یعنی جایی که سرویس ورکر اماده پردازش دستورات است 
const cleanUpCache=()=>{
    caches.keys().then((keys)=>{
return Promise.all(keys.map((key)=>{
    if(key!==Static_Cache_Version && key!==Dynamic_Cache_Version){
        console.log("clean cache..........");
      return  caches.delete(key);
    }
}))
    })
}
///install lifecycle event of service worker/////
self.addEventListener("install",function (event) {
    //if we skipwaiting then the sw will active and start running//
    // self.skipWaiting();
      /// event.waitUntil()این در درجه اول به کار میرود تا مطمین شویم که سرویس ورکر نصب شده در نظر گرفته نمیشود تا زمانی که همه کشهایی که به ان وابسته است پر شوند//
   event.waitUntil(preCache());
})



self.addEventListener("activate",function (event) {
    event.waitUntil(
        cleanUpCache()
    );
    //methode claim barrasi mikonad hamayeh clientha daran az yek service worker estefadeh mikonan.clients yani hameyeh clienthayeh faal masalan hamayeh tabha.
    return self.clients.claim();
})


///functional events of service worker/////
self.addEventListener("fetch",function (event) {
    const request=event.request;
     ///The respondWith() method of FetchEvent prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.به شما اجازه میده خودتان فتچ را هندل کنید
        event.respondWith(
                ///match(request, options):The match() method of the Cache interface returns a Promise that resolves to the Response associated with the first matching request in the Cache object. If no match is found, the Promise resolves to undefined.
            caches.match(request).then((response)=>{
               //اگر یکی از درخواستها با ابجکت کش موجود مچ نشد انگاه ان درخواست را فچ کن و یک کش دینامیک باز کن و ان را داخلش قرار بده.///
                return response || fetch(request).then((response)=>{
                    caches.open(Dynamic_Cache_Version).then((cache)=>{
                            //The put() method of the Cache interface allows key/value pairs to be added to the current Cache object
            //Note: put() will overwrite any key/value pair previously stored in the cache that matches the request.
                       return cache.put(request,response);
                       })
                           ///Clone is needed because put() consumes the response body.
          ///The clone() method of the Response interface creates a clone of a response object, identical in every way, but stored in a different variable.
                       return response.clone();
                }
                   
                ).catch(async (error)=>{
               return caches.open(Static_Cache_Version).then((cache)=>{
                if(request.headers.get("accept").includes("text/html")){
                    return caches.match("/offline.html")
                }
               if (request.url.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
                return caches.match("assets/images/placeholder.png")
               }
               })
                });
            }).catch((error)=>console.log("cache match error ....."))
        )
        ///cache strategies////////////////////
///1-cache only:yani ebteda cache farakhani shavad.
event.respondWith(
    caches.match(request)
);
///2-network only:baryeh masalan mojodi kif pol
event.respondWith(
    fetch(request)
);
///3-cache first falling back to network
event,respondWith(
    caches.match(request).then(function (res) {
        return res || fetch(request)
        .then(function (newRes) {
            caches.open(Dynamic_Cache_Version).then(function (cache) {
              return  cache.put(request,newRes);
            })
            return newRes.clone();
        })
    })
)
///4-network first falling back to cache:baryeh vaghti ast keh app shoma bayad online kar konad va data mohem va hasasi darad keh bayad online bashad vali agar moshkli pish omad az cache bekhon//// 
event.respondWith(
    fetch(request).then(function (response) {
        caches.open(Dynamic_Cache_Version).then(function (cache) {
            cache.put(request,response);
            return response.clone();
        }
        )
    }).catch(err=>{
        return caches.match(request)
    })
)
///5-cache with update network:
event.respondWith(
    caches.match(request).then(function (res) {
        const updateResponse=fetch(request).then(function (newRes) {
            cache.put(request,newRes.clone());
            return newRes;
        })
        return res || updateResponse;
    })
)
///6-cache and network race
let firstRejectionRecived=false;
const rejectOnce=()=>{
    if (firstRejectionRecived) {
        console.log("No response recived...");
    } else {
        firstRejectionRecived=true
    }
}
const promiseRace=new Promise((resolve,reject)=>{
    //try network
fetch(request)
.then(function (response) {
    return response.ok?resolve(response):rejectOnce();
}).catch(rejectOnce);
//try cache
caches.match(request)
.then(res=>res?resolve(res):rejectOnce())
.catch(rejectOnce)
})
event.respondWith(promiseRace)
})

///وقتی ما یک سری تغیرات را در سرویس ورکر حود ایجاد میکنیم.این سرویس ورکر جدید و اپدیت شده وارد حالت انتظار میشوود و تا زمانی که ما اسکیپ ویتینگ ..نکنیم (چه با استفاده از developer tools or self.skipWaiting()).سرویس ورکر جدید اکتیو نمیشود و شروع به کار نمیکند.حتی اگر صفحه را رفرش کنیم.
//نکته : اگر بعد از اکسپ کردن در دولوپر تولز صفخه را رفرش نکنیم تغیرات جدید اعمال نمیشه و سرویس ورکر جدید ران نمیشه.ولی اگر از تابع اسکیپ ویتینگ در کد استفاده کنیم دیکر نیاز نیست و وقتی کاربر به اپلیکیشن ما درخواست میزند به صورت اتومات اپدیت میشه.



