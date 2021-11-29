$(document).ready(function() {
    $("#submit").click(function registerDevice(){
        let txData = {
            deviceName: $('#deviceName').val(),
            deviceID: $('#deviceID').val(),
            deviceToken: $("#deviceToken").val()
        };
        $.ajax({
            url: '/user/register',
            method: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth' : window.localStorage.getItem("token") },
            data: JSON.stringify(txData),
            dataType: 'json'
        })
        .done(function(data, textStatus, jqXHR){
            userName = JSON.stringify(data.message,null,2)
            //successful login, redirects to main page
            //$("#Register").hide()
            $('#rxData').html("Device \"" + txData.deviceName +  "\" registered to account with username " + userName +
             ". Return <a href='home.html'>home</a>");
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            //JSON.stringify(jqXHR.responseJSON.message,null,2)
            //$('#rxData').html(window.localStorage.getItem("token"));
            $('#rxData').html(JSON.stringify(jqXHR.responseJSON.message,null,2).replace(/\"/g, ""));
        });
    });
});
