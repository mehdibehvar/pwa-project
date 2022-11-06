const db=(function () {
    //this is name of database in indexedDB
    const DB_NAME="awesome-pwa-note-db";
    const TABLE_NAME="notes";
    ///check if browser support indexedDB
    if ("indexedDB" in window) {
        console.log("browser support indexedDb");
    }
    ///create and open a database named DB_NAME; 
    /// then if database doesn't contain any table named TABLE_NAME create one in database
    const dbPromise=idb.open(DB_NAME,1,function (database) {
        if(!database.objectStoreNames.contains(TABLE_NAME)){
            database.createObjectStore(TABLE_NAME,{keyPath:"id"});
        }
    });
    ///write and put data in TABLE_NAME
    const writeNotes=function (data) {
        return dbPromise.then(function (database) {
            const tx=database.transaction(TABLE_NAME,"readwrite");
            const store=tx.objectStore(TABLE_NAME);
            store.put(data);
            return tx.complete;
        });
    }
    ////get note
    const getNote=function (id) {
        return dbPromise.then(function (database) {
            return database.transaction(TABLE_NAME,"readwrite")
            .objectStore(TABLE_NAME).get(id);
        })
    }
    ///delete note
    const deleteNote=function (id) {
        return dbPromise.then(function (database) {
            const tx=database.transaction(TABLE_NAME,"readwrite")
            .objectStore(TABLE_NAME).delete(id);
            return tx.complete;
        })
    }
    ///get all notes just notice you should determine accessbility readonly
    const readAllNotes=function () {
        return dbPromise.then(function (database) {
            return database.transaction(TABLE_NAME,'readonly')
            .objectStore(TABLE_NAME).getAll();
        })
    }
    ///clear all notes
    const clearAllNotes=function () {
        return dbPromise.then(function (database) {
            const tx= database.transaction(TABLE_NAME,"readonly")
            .objectStore(TABLE_NAME).clear();
            return tx.complete;
        })
    }
    /// db return these methods
    return{
        writeNotes,
        getNote,
        readAllNotes,
        deleteNote,
        clearAllNotes
    }
})