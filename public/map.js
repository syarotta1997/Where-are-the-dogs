/*Give the lat and lng the map will be centered on, this function loads the map that display all our current users
    GET method used, Google map API used*/
function loadMap(lat, lng) {
    var locations = [];
    $.ajax({
        type : "GET",
        url : "/get_users_locations",
        success : function(result) {
            for (var username in result) {
                locations.push({"lat":result[username].lat, "lng":result[username].lng});
            };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: new google.maps.LatLng(lat, lng)
            });
            infoWindow = new google.maps.InfoWindow;
            // Create an array of alphabetical characters used to label the markers.
            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                var markers = locations.map(function(location, i) {
                    return new google.maps.Marker({
                        position: location,
                        label: labels[i % labels.length]
                    });
                });

                // Add a marker clusterer to manage the markers.
                var markerCluster = new MarkerClusterer(map, markers,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        },
        error : function(result) {
            console.log("error"+result);
        }
    });
}

/*Initilize the map based on whether the user is logined or not

    If user is logined, the map will center on the user's inputted postal code location, otherwise it will center on the IP address location provided by the user's internet service provider using the ipapi API

    GET method used, ipapi (IP Address) API used*/
function initMap() {
    if (window.sessionStorage.getItem("user_token") == null){
        $.getJSON( "https://ipapi.co/json/", function( data ) {
            loadMap(data.latitude, data.longitude);
        });
    } else {
        $.ajax({
            type : "GET",
            url : "/get_user_info",
            headers: {'X-Test-Header': window.sessionStorage.getItem("user_token")},
            success : function(result) {
                loadMap(result.user.lat, result.user.lng);
                $("#title").toggle();
                $("#dropDownDest").toggle();
                $("#show_dog").toggle();
                $("#lgnbtn").hide();
                $("#account").toggle();
            },
            error : function(result) {
                $.getJSON( "https://ipapi.co/json/", function( data ) {
                    loadMap(data.latitude, data.longitude);
                });
            }
        });
    }
}

/*This function is for testing backend, feel free to change things around to test, this is called when user presses our app's logo*/
function test_verify() {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + "m6k2w9" + '&key=AIzaSyC7DCk1x1qnhX-z5aWICmzYN54_Zcrwu1w';
    $.getJSON(url, function( data ) {
        alert('first')
        $.getJSON(url, function( result ) {
            alert("second");
        });
    });
    $.ajax({
        type : "GET",
        url : "/get_user_info",
        headers: {'X-Test-Header': window.sessionStorage.getItem("user_token")},
        success : function(result) {
            alert(result.user.firstName);
        },
        error : function(result) {
            console.log(result);
        }
    });
}
