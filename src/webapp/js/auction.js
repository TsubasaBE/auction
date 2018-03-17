const {ipcRenderer} = require('electron');

var serialize = require('form-serialize-json');

function updatePresentationWindow(event){
    // console.log("GNAR!");

    form = document.querySelector('#frm');
    var jsonform = serialize(form);

    ipcRenderer.send('updatePresentationWindow', jsonform);

    document.querySelector('#price').select();
}

function formInputCheck(event) {
    if( event.key == "Enter" ) {
        updatePresentationWindow();
    }
}


document.querySelector("#btnUpdatePresentationWindow").addEventListener('click', updatePresentationWindow);
document.querySelector("#frm").addEventListener('keypress', formInputCheck);
