if ("serviceWorker" in navigator) {
    window.addEventListener("load",function () {
        navigator.serviceWorker.register("sw.js").then(function () {
            console.log("service worker registered.");
        }).catch(function () {
            console.log("service worker error");
        })
    })
}