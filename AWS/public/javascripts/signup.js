var email = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');
var strength = 0  
$(document).ready(function() {
    $("#submit").click(function loginUser(){
        if(!email.test($('#email').val())){
            window.alert("Please enter a valid email address")
        }
        else if(strength < 2){
            window.alert("Please enter a stronger password. Try using special characters, numbers, or mixing upper/lower case")
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

$(document).ready(function () {  
    $('#password').keyup(function () {  
        $('#strengthMessage').html(checkStrength($('#password').val()))  
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
