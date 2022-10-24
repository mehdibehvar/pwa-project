self.addEventListener("install",function (event) {
    console.log("service worker sugest installing...",event);
    //if we skipwaiting then the sw will active and start running//
    // self.skipWaiting();
})
self.addEventListener("activate",function (event) {

    console.log("service worker is activated and is running",event);
})
self.addEventListener("fetch",function (event) {
    console.log("[Service Worker] Fetched resource",event);
})

///وقتی ما یک سری تغیرات را در سرویس ورکر حود ایجاد میکنیم.این سرویس ورکر جدید و اپدیت شده وارد حالت انتظار میشوود و تا زمانی که ما اسکیپ ویتینگ ..نکنیم (چه با استفاده از developer tools or self.skipWaiting()) .سرویس ورکر جدید اکتیو نمیشود و شروع به کار نمیکند.حتی اگر صفحه را رفرش کنیم.
//نکته : اگر بعد از اکسپ کردن در دولوپر تولز صفخه را رفرش نکنیم تغیرات جدید اعمال نمیشه و سرویس ورکر جدید ران نمیشه.ولی اگر از تابع اسکیپ ویتینگ در کد استفاده کنیم دیکر نیاز نیست و وقتی کاربر به اپلیکیشن ما درخواست میزند به صورت اتومات اپدیت میشه.



