const { ipcRenderer } = require('electron');

const serialize = require('form-serialize-json');

function updatePresentationWindow() {
  try {
    // console.log("GNAR!");

    const form = document.querySelector('#frm');
    const jsonform = serialize(form);

    ipcRenderer.send('updatePresentationWindow', jsonform);

    document.querySelector('#price').select();
  } catch (e) {
    ipcRenderer.send('logException', e.message, e.stack);
  }
}

function formInputCheck(event) {
  try {
    if (event.key === 'Enter') {
      updatePresentationWindow();
    }
  } catch (e) {
    ipcRenderer.send('logException', e.message, e.stack);
  }
}


document.querySelector('#btnUpdatePresentationWindow').addEventListener('click', updatePresentationWindow);
document.querySelector('#frm').addEventListener('keypress', formInputCheck);
