var DB_NAME="awesome-pwa-note-db";
var TABLE_NAME="notes"
if ("indexedDB" in window) {
    console.log("support indexeddb.....");
}
var dbPromise=idb.open(DB_NAME,1, function (db) {
    if(!db.objectStoreNames.contains(db)){
        db.createObjectStore(TABLE_NAME,{keyPath:"id"});
    }
});
var writeNote=function (data) {
    return dbPromise.then(function (db) {
        const tx = db.transaction(TABLE_NAME, 'readwrite');
        const store = tx.objectStore(TABLE_NAME);
        store.put(data);
        return tx.done;
    })
}

fetch("notes.json")
.then(function (response) {
    return response.json();
}).then(function (data) {
 for(let key in data){
    writeNote(data[key])
    .then(function () {
        console.log("write note done",key);
    }).catch(console.error)
 }
})





const fab=document.querySelector("#fab");
var beforeinstallpromptEvent;
fab.addEventListener("click",function () {
    if (beforeinstallpromptEvent) {
        beforeinstallpromptEvent.prompt("do you want install awesome note app?");
        beforeinstallpromptEvent.userChoice.then(function (choice) {
            if (choice.outcome==="dismissed") {
                console.log(choice);
            }else{
                ///shoma mitavanid bar asas javab karbar data ra az api begirid.va ....
                console.log(choice);
            }
        })
        //we null the beforeinstallpromptEvent to beforeinstallprompt don't execute again.just execute one time;if app installed this code will not execute again.
        beforeinstallpromptEvent=null;
    }
})
window.addEventListener("beforeinstallprompt",function (event) {
    event.preventDefault();
    beforeinstallpromptEvent=event;
})
if ("serviceWorker" in navigator) {
    window.addEventListener("load",function () {
        navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(function (swRegisRes) {
            console.log("service worker registered.");
        }).catch(function () {
            console.log("service worker error");
        })
    })
}