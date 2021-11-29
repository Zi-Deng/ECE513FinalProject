var email = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');

$(document).ready(function() {
    $("#submit").click(function loginUser(){
        if(!email.test($('#email').val())){
            window.alert("Please enter a valid email address")
        }
        else{
            let txData = {
                username: $('#email').val(),
                password: $('#password').val()
            };
            $.ajax({
                url: '/user/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txData),
                dataType: 'json'
            })
            .always(function(data, textStatus, jqXHR){
		$('#rxData').html(JSON.stringify(data.message,null,2).replace(/\"/g, ""))
                $("#email").val('')
                $("#password").val('')
            })
            .done(function(data, textStatus, jqXHR){
                //successful login, redirects to main page
                localStorage.setItem("token", data.token);
                window.location.replace("home.html");
                //$('#rxData').html(data.message);
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                //JSON.stringify(jqXHR.responseJSON.message,null,2)
		        $('#rxData').html(JSON.stringify(jqXHR.responseJSON.message,null,2).replace(/\"/g, ""));
            });
        }
    });
});
