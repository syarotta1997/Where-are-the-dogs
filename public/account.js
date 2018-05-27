/*Display user setting page when appropriate*/
function show_setting(){
      if($("#accountpage").is(":hidden")){
        if($(".map").is(":visible")){
          goback=".map"
          $(".map").slideUp(500, function() {
            $("#accountpage").slideDown(500);
          });

        } else if($(".doglist").is(":visible")){
          goback=".doglist"
          $(".doglist").slideUp(500, function() {
            $("#accountpage").slideDown(500);
          });

        }
        display_breed("#acc_dropdown");
      }
  }

/*Update our user
    PUT method used*/
function update_info(){
        $.ajax({
            type: "PUT",
            url:"/update",
            headers: {
                'X-Test-Header': window.sessionStorage.getItem("user_token")},
            data: {
                "f_name": document.getElementById("nfname").value,
                "l_name":document.getElementById("nlname").value,
                "email": document.getElementById("nemail").value,
                "pass": document.getElementById("npword").value,
                "zip":document.getElementById("nzip").value,
                "breed":document.getElementById("acc_dropdown").value
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("action failed, please try again later!");
            },
            success: function(result){
                window.sessionStorage.setItem('user_token', result.token);
                window.location.reload();
            }
        });
}

/*Clear cache and let user sign out*/
function sign_out(){
    window.sessionStorage.clear();
    window.location.reload();
}

/*Go back to main page*/
function account_goback(){
    $("#accountpage").slideUp(500, function() {
        $(goback).slideDown(500);
      });
}

/*Delete our user
    DELETE method used*/
function delete_user(){
    $.ajax({
            type: "DELETE",
            url:"/delete_user",
            headers: {'X-Test-Header': window.sessionStorage.getItem("user_token")},
            success: function(result){
               console.log("worked!")
            }
        });
    sign_out();
}

/*Display breed of the dropdown breed select list, also used in login*/
function display_breed(tag){
    $.get("https://dog.ceo/api/breeds/list/all", function(data, status){
        $.each(data.message,function(key,value) {
            var option = $('<option />').text(key);
            $(tag).append(option);
        });
    });
}
