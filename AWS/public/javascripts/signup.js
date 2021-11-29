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
                url: '/user/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txData),
                dataType: 'json'
            })
            .always(function(data, textStatus, jqXHR){
		        //$('#rxData').html(JSON.stringify(data.responseJSON,null,2))
                $("#email").val('')
                $("#password").val('')
            })
            .done(function(data, textStatus, jqXHR){
                //successful login, redirect to sign in
                $('#rxData').html("Account created successfully, sign in <a href='signin.html'>here</a>");
            })
            .fail(function(jqXHR, textStatus, errorThrown){
		        $('#rxData').html(JSON.stringify(jqXHR.responseJSON.message,null,2).replace(/\"/g, ""));
            });
        }
    });
});
