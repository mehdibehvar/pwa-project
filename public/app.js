
// fetch("notes.json")
// .then(function (response) {
//     return response.json();
// }).then(function (data) {
//  for(let key in data){
//     writeNote(data[key])
//     .then(function () {
//         console.log("write note done",key);
//     }).catch(console.error)
//  }
// })




if ("serviceWorker" in navigator) {
    window.addEventListener("load",function () {
        navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(function (swRegisRes) {
            console.log("service worker registered.");
        }).catch(function () {
            console.log("service worker error");
        })
    })
}
///click to install app

// const fab=document.querySelector("#fab");
// var beforeinstallpromptEvent;
// fab.addEventListener("click",function () {
//     if (beforeinstallpromptEvent) {
//         beforeinstallpromptEvent.prompt("do you want install awesome note app?");
//         beforeinstallpromptEvent.userChoice.then(function (choice) {
//             if (choice.outcome==="dismissed") {
//                 console.log(choice);
//             }else{
//                 ///shoma mitavanid bar asas javab karbar data ra az api begirid.va ....
//                 console.log(choice);
//             }
//         })
//         //we null the beforeinstallpromptEvent to beforeinstallprompt don't execute again.just execute one time;if app installed this code will not execute again.
//         beforeinstallpromptEvent=null;
//     }
// })
// window.addEventListener("beforeinstallprompt",function (event) {
//     event.preventDefault();
//     beforeinstallpromptEvent=event;
// })