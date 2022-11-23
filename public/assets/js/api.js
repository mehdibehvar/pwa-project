const serverUrl="http://localhost:6060/notes/"
const BACKGROUND_SYNC_SAVE="new-notes-sync";
const BACKGROUND_SYNC_DELETE="delete-notes-sync";
function getAllNotes() {
    return fetch(serverUrl);
}
function getById(id) {
    return fetch(serverUrl+id);
}
function updateData(noteData) {
    return fetch(serverUrl+noteData.id,{
 method:"Put",
 headers:{
    " Content-Type":"application/json",
    "Accept":"application/json"
 },
 body:JSON.stringify(noteData)
    }) 
 }
function deleteData(id) {
    return fetch(serverUrl+id,{
        method:"Delete",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    })
}
function sendData(noteData) {
    return fetch(serverUrl,{
        method:"Post",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body:JSON.stringify(noteData)

    })
}