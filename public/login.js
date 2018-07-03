var goback = "";

/*Show login page when appropriate*/
function show_login(){

    if($("#login").is(":hidden")){
      if($(".map").is(":visible")){
        goback=".map"
        $(".map").slideUp(500, function() {
          $("#login").slideDown(500);
        });

      } else if($(".doglist").is(":visible")){
        goback=".doglist"
        $(".doglist").slideUp(500, function() {
          $("#login").slideDown(500);
        });

      }
      display_breed("#reg_dropdown");
    }
}

/*Go back to main page*/
function login_goback(){
    $(".logindiv").slideUp(500, function() {
      $(goback).slideDown(500);
    });
}

/*Register our new user
    POST method used*/
function register(){
        $.ajax({
            type: "POST",
            url:"/register",
            data: {
                "f_name": document.getElementById("fname").value,
                "l_name":document.getElementById("lname").value,
                "email": document.getElementById("email").value,
                "user":document.getElementById("user").value,
                "pass": document.getElementById("pword").value,
                "zip":document.getElementById("zip").value,
                "breed":document.getElementById("reg_dropdown").value
                // We add lat and lgn at backend
            },
            dataType:"json",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                if (XMLHttpRequest.status == 401) {
                    alert('username taken');
                } else if (XMLHttpRequest.status < 300 && XMLHttpRequest.status >= 200) {
                    alert('You are now registered, welcome');
                }else  {
                    alert('action failed, please try again later');
                }
            },
            success: function(result){
                window.sessionStorage.setItem('user_token', result.token);
                window.sessionStorage.setItem('selected_breed', document.getElementById("dropDownDest").value);
                window.location.reload();
            }
        });
}

/*Authenticate and log our user in
    POST method used*/
function authenticate() {
    $.ajax({
        type: "POST",
        url:"/authenticate",
        data: {
            "user_login": document.getElementById("login_username").value,
            "pass_login":document.getElementById("login_password").value
        },
        dataType:"json",
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 400) {
                alert('no such user');
            } else if (XMLHttpRequest.status == 401) {
                alert('wrong password');
            } else if (XMLHttpRequest.status < 300 && XMLHttpRequest.status >= 200){
                alert('Login Success, welcome');
            } else  {
                alert('action failed, please try again later');
            }
      },
        success: function(result){
            window.sessionStorage.setItem("user_token", result.token);
            window.sessionStorage.setItem('selected_breed', document.getElementById("dropDownDest").value);
            window.location.reload();
        }
    });
}
