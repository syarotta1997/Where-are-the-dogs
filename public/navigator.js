/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

/* Close the dropdown if the user clicks outside of it*/
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/*Populate our drop down breed list*/
$(document).ready(function() {
    $.get("https://dog.ceo/api/breeds/list/all", function(data, status){
        $.each(data.message,function(key,value) {
            var option = $('<option />').text(key);
            $("#dropDownDest").append(option);
        });
    });
});
