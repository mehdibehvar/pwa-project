////The ServiceWorker interface is dispatched a set of lifecycle events — install and activate — and functional events including fetch.
const Static_Cache_Version="static3";
const Dynamic_Cache_Version="dynamic2";
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
        keys.map((key)=>{
            if(key!==Static_Cache_Version && key!==Dynamic_Cache_Version){
                caches.delete(key);
            }
        })
    })
}
///install lifecycle event of service worker/////
self.addEventListener("install",function (event) {
    console.log("service worker sugest installing...");
    //if we skipwaiting then the sw will active and start running//
    // self.skipWaiting();
      /// event.waitUntil()این در درجه اول به کار میرود تا مطمین شویم که سرویس ورکر نصب شده در نظر گرفته نمیشود تا زمانی که همه کشهایی که به ان وابسته است پر شوند//
   event.waitUntil(preCache())
})



self.addEventListener("activate",function (event) {
    console.log("service worker is activated and is running",event);
    event.waitUntil(
        cleanUpCache()
    )
})


///functional events of service worker/////
self.addEventListener("fetch",function (event) {
    console.log("[Service Worker] Fetched resource...");
    const request=event.request;
     ///The respondWith() method of FetchEvent prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.به شما اجازه میده خودتان فتچ را هندل کنید
        event.respondWith(
                ///match(request, options):The match() method of the Cache interface returns a Promise that resolves to the Response associated with the first matching request in the Cache object. If no match is found, the Promise resolves to undefined.
            caches.match(request).then((response)=>{
               //اگر یکی از درخواستها با ابجکت کش موجود مچ نشد انگاه ان درخواست را فچ کن و یک کش دینامیک باز کن و ان را داخلش قرار بده.
                return response || fetch(request).then((response)=>{
                    console.log("xxxxxxxxx");
                    console.log(response.clone());
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

})

///وقتی ما یک سری تغیرات را در سرویس ورکر حود ایجاد میکنیم.این سرویس ورکر جدید و اپدیت شده وارد حالت انتظار میشوود و تا زمانی که ما اسکیپ ویتینگ ..نکنیم (چه با استفاده از developer tools or self.skipWaiting()).سرویس ورکر جدید اکتیو نمیشود و شروع به کار نمیکند.حتی اگر صفحه را رفرش کنیم.
//نکته : اگر بعد از اکسپ کردن در دولوپر تولز صفخه را رفرش نکنیم تغیرات جدید اعمال نمیشه و سرویس ورکر جدید ران نمیشه.ولی اگر از تابع اسکیپ ویتینگ در کد استفاده کنیم دیکر نیاز نیست و وقتی کاربر به اپلیکیشن ما درخواست میزند به صورت اتومات اپدیت میشه.



