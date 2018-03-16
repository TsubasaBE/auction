const {ipcRenderer} = require('electron');

var serialize = require('form-serialize-json');

function updatePresentationWindow(event){
    // console.log("GNAR!");

    form = document.querySelector('#frm');
    var jsonform = serialize(form);

    ipcRenderer.send('updatePresentationWindow', jsonform);

    document.querySelector('#price').select();
}




document.querySelector("#btnUpdatePresentationWindow").addEventListener('click', updatePresentationWindow);

$( document ).ready(function() {
    console.log( "ready!" );
});