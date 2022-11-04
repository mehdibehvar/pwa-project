////The ServiceWorker interface is dispatched a set of lifecycle events — install and activate — and functional events including fetch.
const Google_Font_Url="https://fonts.gstatic.com";
const Static_Cache_Version="static4";
const Dynamic_Cache_Version="dynamic4";
///به هیچ وجه sw.js را کش نکنید چون اگر کش بشه از داخل کش خونده میشه و به هیچ وجه اپدیت نمیشه.
const Static_Assets=[
    "/",
    "/add.html",
    "/index.html",
    "/offline.html",
    "/assets/css/style.css",
    "/assets/css/libs/material.min.css",
    "https://fonts.googleapis.com/css?family=Roboto:400,700",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "/manifest.json",
    "/favicon.ico",
    "/app.js",
    "/assets/images/placeholder.png",
    "/assets/js/helpers.js",
    "/assets/js/libs/material.min.js",
    "/assets/js/main.js",
    "/assets/js/libs/fetch.js",
    "/assets/js/libs/promise.js"
];
const preCache=async ()=>{
    console.log("precacheing...................");
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
function isInclude(string,array) {
    console.log(("urlstring===:"+string));
    var path;
    ///:self.orgin==== http://localhost:8080
    ////string===:http://localhost:8080/assets/css/style.css
    ///string.substring(self.origin.length)=/assets/css/style.css
    if(string.indexOf(self.origin)===0){
      path=string.substring(self.origin.length);
      console.log(("staticpath=="+path));
    }else{
        ///for cdn
        ////string=https://fonts.googleapis.com/css?family=Roboto:400,700
        path=string;
        console.log(("dynamicpath="+path));
    }
    console.log(array.includes(path));
    // return array.indexOf(path) > -1;
    return array.includes(path);
}
///https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2
const isGoogleStaticUrl=(request)=>{
return request.indexOf(Google_Font_Url)===0;
}
const cacheGoogleFont=async (request)=>{
   return fetch(request).then(function (res) {
    caches.open(Dynamic_Cache_Version).then(function (cache) {
        cache.put(request,res);
    })
    return res.clone();
   })
}
///functional events of service worker/////
self.addEventListener("fetch",function (event) {
    const request=event.request;
     ///The respondWith() method of FetchEvent prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.به شما اجازه میده خودتان فتچ را هندل کنید
if(isInclude(request.url,Static_Assets)){
   event.respondWith(
    caches.match(request).then(function (response) {
        return response   
    })
    );
}
if (isGoogleStaticUrl(request.url)) {
  event.respondWith(
    caches.match(request.url).then(function (response) {
        return response || cacheGoogleFont(request.url)
    })
  )
}
   
        // event.respondWith(
        //         ///match(request, options):The match() method of the Cache interface returns a Promise that resolves to the Response associated with the first matching request in the Cache object. If no match is found, the Promise resolves to undefined.
        //     caches.match(request).then((response)=>{
        //        //اگر یکی از درخواستها با ابجکت کش موجود مچ نشد انگاه ان درخواست را فچ کن و یک کش دینامیک باز کن و ان را داخلش قرار بده.///
        //         return response || fetch(request).then((response)=>{
        //             caches.open(Dynamic_Cache_Version).then((cache)=>{
        //                     //The put() method of the Cache interface allows key/value pairs to be added to the current Cache object
        //     //Note: put() will overwrite any key/value pair previously stored in the cache that matches the request.
        //                return cache.put(request,response);
        //                })
        //                    ///Clone is needed because put() consumes the response body.
        //   ///The clone() method of the Response interface creates a clone of a response object, identical in every way, but stored in a different variable.
        //                return response.clone();
        //         }
                   
        //         ).catch(async (error)=>{
        //        return caches.open(Static_Cache_Version).then((cache)=>{
        //         if(request.headers.get("accept").includes("text/html")){
        //             return caches.match("/offline.html")
        //         }
        //        if (request.url.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
        //         return caches.match("assets/images/placeholder.png")
        //        }
        //        })
        //         });
        //     }).catch((error)=>console.log("cache match error ....."))
        // )

})

///وقتی ما یک سری تغیرات را در سرویس ورکر حود ایجاد میکنیم.این سرویس ورکر جدید و اپدیت شده وارد حالت انتظار میشوود و تا زمانی که ما اسکیپ ویتینگ ..نکنیم (چه با استفاده از developer tools or self.skipWaiting()).سرویس ورکر جدید اکتیو نمیشود و شروع به کار نمیکند.حتی اگر صفحه را رفرش کنیم.
//نکته : اگر بعد از اکسپ کردن در دولوپر تولز صفخه را رفرش نکنیم تغیرات جدید اعمال نمیشه و سرویس ورکر جدید ران نمیشه.ولی اگر از تابع اسکیپ ویتینگ در کد استفاده کنیم دیکر نیاز نیست و وقتی کاربر به اپلیکیشن ما درخواست میزند به صورت اتومات اپدیت میشه.

///cache strategies////////////////////
///1-cache only:yani ebteda cache farakhani shavad.
// event.respondWith(
//     caches.match(request)
// );
///2-network only:baryeh masalan mojodi kif pol
// event.respondWith(
//     fetch(request)
// );
///3-cache first falling back to network
// event.respondWith(
//     caches.match(request).then(function (res) {
//         return res || fetch(request)
//         .then(function (newRes) {
//             caches.open(Dynamic_Cache_Version).then(function (cache) {
//               return  cache.put(request,newRes);
//             })
//             return newRes.clone();
//         })
//     })
// )
///4-network first falling back to cache:baryeh vaghti ast keh app shoma bayad online kar konad va data mohem va hasasi darad keh bayad online bashad vali agar moshkli pish omad az cache bekhon//// 
// event.respondWith(
//     fetch(request).then(function (response) {
//         caches.open(Dynamic_Cache_Version).then(function (cache) {
//             cache.put(request,response);
//             return response.clone();
//         }
//         )
//     }).catch(err=>{
//         return caches.match(request)
//     })
// )
///5-cache with update network:
// event.respondWith(
//     caches.match(request).then(function (res) {
//         const updateResponse=fetch(request).then(function (newRes) {
//             cache.put(request,newRes.clone());
//             return newRes;
//         })
//         return res || updateResponse;
//     })
// )
///6-cache and network race
// let firstRejectionRecived=false;
// const rejectOnce=()=>{
//     if (firstRejectionRecived) {
//         console.log("No response recived...");
//     } else {
//         firstRejectionRecived=true
//     }
// }
// const promiseRace=new Promise((resolve,reject)=>{
//     //try network
// fetch(request)
// .then(function (response) {
//     ///The ok read-only property of the Response interface contains a Boolean stating whether the response was successful (status in the range 200-299) or not.
//     return response.ok?resolve(response):rejectOnce();
// }).catch(rejectOnce);
// //try cache
// caches.match(request)
// .then(res=>res?resolve(res):rejectOnce())
// .catch(rejectOnce)
// })
// event.respondWith(promiseRace)


