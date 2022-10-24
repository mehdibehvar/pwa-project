const fab=document.querySelector("#fab");
var beforeinstallpromptEvent;
fab.addEventListener("click",function () {
    if (beforeinstallpromptEvent) {
        beforeinstallpromptEvent.prompt("do you want install awesome note app?");
        beforeinstallpromptEvent.userChoice.then(function (choice) {
            if (choice.outcome==="dismissed") {
                console.log(choice);
            }else{
                console.log(choice);
            }
        })
        //we null the beforeinstallpromptEvent to beforeinstallprompt don't execute again.just execute one time;
        beforeinstallpromptEvent=null;
    }
})
window.addEventListener("beforeinstallprompt",function (event) {
    console.log(event);
    event.preventDefault();
    beforeinstallpromptEvent=event;
})
if ("serviceWorker" in navigator) {
    window.addEventListener("load",function () {
        navigator.serviceWorker.register("sw.js").then(function () {
            console.log("service worker registered.");
        }).catch(function () {
            console.log("service worker error");
        })
    })
}