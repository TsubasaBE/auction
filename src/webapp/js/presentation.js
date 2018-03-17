const {ipcRenderer} = require('electron');

let previousPrice = "";

ipcRenderer.on("updateLabels", (event, form) => {
    console.log(form);

    $("#lblLotNr").html(form.lotNr);

    $("#lblPrice").html(form.price);
    if( previousPrice != form.price ) {
        $('#lblCurrencyPrice').removeClass().addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }
    previousPrice = form.price;
    
    $("#lblCurrency").html(form.currency);
});
