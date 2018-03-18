const { ipcRenderer } = require('electron');

const serialize = require('form-serialize-json');

function updatePresentationWindow(event) {
  // console.log("GNAR!");

  const form = document.querySelector('#frm');
  const jsonform = serialize(form);

  ipcRenderer.send('updatePresentationWindow', jsonform);

  document.querySelector('#price').select();
}

function formInputCheck(event) {
  if (event.key === 'Enter') {
    updatePresentationWindow();
  }
}


document.querySelector('#btnUpdatePresentationWindow').addEventListener('click', updatePresentationWindow);
document.querySelector('#frm').addEventListener('keypress', formInputCheck);
