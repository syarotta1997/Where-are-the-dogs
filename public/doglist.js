/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDogList() {

	if ( $( ".doglist" ).is( ":hidden" )) {
		initlist({});
		$( ".doglist" ).slideDown()
					   .queue(function(){
							if ($(this).is("visible")){
								$(".map").hide().dequeue();}}
		)
		.dequeue()
		.show();
	  }
	else{
		if (event.target.matches('.dropbtn')) {
			initlist({});
		}
	}
}

/*Assuming data is json, initlize the list
	GET method used, Dog API used*/
function initlist(data){
	//removes the previous contents of the doglist before adding new ones
	if ($('.doglist div li').length != 0){
		$( ".doglist ul li" ).remove();
	}
	var breed = $("#dropDownDest").val();
	getdoginfo(breed,function(usrs){
		$.each(usrs,(key,value)=>{
			// console.log(key);
			var url = "https://dog.ceo/api/breed/"+breed+"/images/random";
			var li_text = "<li>";
			$.get(url, function(data, status){
					li_text += "<img src=" + data.message + ">";
					li_text += "<h3> Breed: "+ breed +"</h3>";
					li_text += "<h3> Owner: "+ value.name +"</h3>";
					li_text += "<h3> Distance: " + value.dist + " m </h3>";
					li_text += "</li>";
					$(".doglist ul").append(li_text);
				}
			);
		});
	});

}

/*Close the dropdown if the user clicks outside of it*/
function hideDogList() {
	if ($("#doglist").not(':hidden')){
		$("#logindiv").hide();
		$( "#doglist" ).slideUp();
		$("#map").show();
	}
}

/*Retrieves info from database based on usr selected breed and creates a sorted array of user objects with ascending distance order to usr
	GET method used*/
function getdoginfo(breed,callback){

	$.ajax({
        type : "GET",
        url : "/users",
        headers: {'X-Test-Header': window.sessionStorage.getItem("user_token")},
        success : function(result) {
			var query_result = [];
			for (var user_id in result) {
				var user = result[user_id]
				if (user.breed == breed){
					query_result.push(user);
				}
			};
			sort_by_dist(query_result,callback);
        },
        error : function(result) {
			console.log("error: "+ result);
        }
	});
}

/*Sorting our users to be displayed by their distance with the current logined user
	GET method used*/
function sort_by_dist(list,callback){
	var temp = [];
	var cur_loc = {};
	$.ajax({
        type : "GET",
        url : "/curuserloc",
        headers: {'X-Test-Header': window.sessionStorage.getItem("user_token")},
        success : function(result) {
			cur_loc = result;
			// console.log("cur_loc");
			// console.log(cur_loc);
			$.each(list,(key,value)=>{
				var lat1 = cur_loc.lat
				var lon1 = cur_loc.lng
				var lat2 = value.lat
				var lon2 = value.lng
				var dist = getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)
				if (! isNaN(dist)){
					temp.push({"name":value.name, "dist":dist})
				}
			})
			temp.sort(compare);
			// console.log(temp);
			callback(temp);
        },
        error : function(result) {
			console.log("error: "+ result);
        }
	});
}

/*helper for sort_by_dist*/
function compare(usr1, usr2){
	  const dist1 = usr1.dist;
	  const dist2 = usr2.dist;
	  let comparison = 0;
	  if (dist1 > dist2) {
	    comparison = 1;
	  } else {
	    comparison = -1;
	  }
	  return comparison;
}

/*helper for sort_by_dist*/
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371000; // Radius of the earth in m
	  var dLat = deg2rad(Math.abs(lat2-lat1));  // deg2rad below
	  var dLon = deg2rad(Math.abs(lon2-lon1));
	  var a =
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ;
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	  var d = R * c; // Distance in m
	  return Math.round(d);
	}

/*helper for calculation*/
function deg2rad(deg) {
	return deg * (Math.PI/180)
}
