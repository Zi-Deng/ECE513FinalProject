var strength = 0
function organizePage(){
    $.ajax({
    url: '/user/page',
    method: 'GET',
    dataType: 'json',
    headers: { 'x-auth' : window.localStorage.getItem("token") }
    }).done(function(data, textStatus, jqXHR){
        if("devices" in data){
            var dev = 0;
            data.devices.forEach(element => {
                $("#devices").append('<option value='+dev+'>'+element.name+'</option>')
                // var option = document.createElement("option");
                // option.text = element.name
                // option.value = dev
                // if (dev == 0) option.selected = true
                dev+=1
                // $("#devices").appendChild(option)
            });
        }
        else{
            //no devices registered
            $("#rxData").html("You have no devices registered, you may do so <a href='registerdevice.html'>here</a>")
        }
    })
}

$(document).ready(function() {
    $("#submit").click(function registerDevice(){
        $('#rxData').html("");
        let txData = {};
        if($("#curPassword").val() != "" && $("#newPassword").val() == ""){
            $('#rxData').html("Please enter your new password");
            return
        }
        if($("#newPassword").val() != ""){
            if (strength < 2){
                $('#rxData').html("Please enter a valid new password");
                return
            }
            else{
                txData["curPass"] = $("#curPassword").val();
                txData["newPass"] = $("#newPassword").val();
            }
        }
        if($("#zip").val() != ""){
            if($("#zip").val().match(/^\d\d\d\d\d$/)) {txData["zip"] = $("#zip").val();}
            else{
                $('#rxData').html("Please enter a valid zip code");
                return
            }
        }
        $.ajax({
            url: '/user/update',
            method: 'POST',
            contentType: 'application/json',
            headers: { 'x-auth' : window.localStorage.getItem("token") },
            data: JSON.stringify(txData),
            dataType: 'json'
        })
        .done(function(data, textStatus, jqXHR){
            //userName = JSON.stringify(data.message,null,2)
            //successful login, redirects to main page
            //$("#Register").hide()
            $('#rxData').html(JSON.stringify(data.message,null,2).replace(/\"/g, ""));
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            //JSON.stringify(jqXHR.responseJSON.message,null,2)
            //$('#rxData').html(window.localStorage.getItem("token"));
            $('#rxData').html(JSON.stringify(jqXHR,null,2));
            // $('#rxData').html(JSON.stringify(txData));
        });
    });
});

$(document).ready(function () {  
    $('#newPassword').keyup(function () {  
        $('#strengthMessage').html(checkStrength($('#newPassword').val()))  
    })  
    function checkStrength(password) {
        strength = 0    
        if (password.length < 6) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Short')  
            return 'Password too short'  
        }  
        if (password.length > 7) strength += 1  
        // If password contains both lower and uppercase characters, increase strength value.  
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
        // If it has numbers and characters, increase strength value.  
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1  
        // If it has one special character, increase strength value.  
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
        // If it has two special characters, increase strength value.  
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
        // Calculated strength value, we can return messages  
        // If value is less than 2  
        if (strength < 2) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Weak')  
            return 'Weak Password'  
        } else if (strength == 2) {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Good')  
            return 'Good Password'  
        } else {  
            $('#strengthMessage').removeClass()  
            $('#strengthMessage').addClass('Strong')  
            return 'Strong Password'  
        }  
    }  
});  

function removeDev(){
    var device = $("#devices option:selected").text()
    console.log(device)
    $.ajax({
        url: '/particle/remdev',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({selected: device}),
        headers: { 'x-auth' : window.localStorage.getItem("token") }
    })
    .done(function(data, textStatus, jqXHR){
        $("#rxData").html("Removed device with name: " + JSON.stringify(data.message,null,2).replace(/\"/g, ""))
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        $("#rxData").html(JSON.stringify(jqXHR.responseJSON.message,null,2).replace(/\"/g, ""))
    })
}
