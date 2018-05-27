var path = require("path");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express');
const bodyParser= require('body-parser');
var http = require('http');
const app = express();
var apiRoutes = express.Router();
const User = require("./lib/user");
var session = require("express-session");
var cookieParser = require('cookie-parser');
var passport = require('passport');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./config');

var db

var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.use(express.static(path.join(__dirname, '/public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(cookieParser());
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.listen(port);

/*Authenticate and login our user, returns a token to front end on success*/
app.post('/authenticate', (req, res)  => {
    var username = req.body.user_login;
	var password = req.body.pass_login;
    User.findOne({username: username}, function(err, user) {
        if(err){
			console.log(err);
		}
        if (!user) {
            return res.status(400).json({err: 'no such user'});
		}
		else if (user) {
            // check if password matches
            if (user.password != password) {
                return res.status(401).json({err: 'wrong password'});
            } else {
                 // we don't want to pass in the entire user since that has the password
				var token = jwt.sign({firstName: user.firstName, lastName: user.lastName, email: user.email,
					username: user.username, postalCode:user.postalCode, lat:user.lat, lng:user.lng, breed:user.breed}, app.get('superSecret'));
                // return the information including token as JSON
                return res.status(200).json({ token: token});
            }
        }
    });
});

/*Helper function to use get request from third party API at backend*/
function httpGet(theUrl){
    console.log('a');
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/*Register a new user, returns the user token to front end on success*/
app.post('/register', (req, res) => {
    User.findOne({username: req.body.user}, function(err, user) {
        if (user) {
            return res.status(401).json({
    			success: false,
    			message: 'username taken'
    		});
        }
    });

        var url = 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + req.body.zip + '&key=AIzaSyC7DCk1x1qnhX-z5aWICmzYN54_Zcrwu1w';
        var callresponse = JSON.parse(httpGet(url));
        console.log(callresponse);
            var newuser = new User();
    		newuser.firstName = req.body.f_name;
    		newuser.lastName = req.body.l_name;
    		newuser.email = req.body.email;
    		newuser.username = req.body.user;
    		newuser.password = req.body.pass;
    		newuser.postalCode = req.body.zip;
            newuser.lat = callresponse.results[0].geometry.location.lat;
            newuser.lng = callresponse.results[0].geometry.location.lng;
    		newuser.breed = req.body.breed;

            var token;
            newuser.save(function(err, savedUser){
    			if(err){
    				console.log(err);
    			} else {
                    token = jwt.sign({firstName: newuser.firstName, lastName: newuser.lastName, email: newuser.email,
                    username: newuser.username, postalCode:newuser.postalCode, lat:newuser.lat, lng:newuser.lng, breed:newuser.breed}, app.get('superSecret'));
                    return res.status(200).json({ token: token});
                }
    		});
});

/*Update our current logined user's information except username, return the updated token to front end on success*/
app.put('/update', verify_authentication, (req, res) => {
    var curr_user = req.decoded;
    var conditions = {
        username : curr_user.username
    }
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + curr_user.postalCode + '&key=AIzaSyC7DCk1x1qnhX-z5aWICmzYN54_Zcrwu1w';
    var callresponse = JSON.parse(httpGet(url));

    var update ={"firstName": req.body.f_name,
        "lastName": req.body.l_name,
        "email": req.body.email,
        "password": req.body.pass,
        "postalCode": req.body.zip,
        "lat": callresponse.results[0].geometry.location.lat,
        "lng": callresponse.results[0].geometry.location.lng,
        "breed": req.body.breed
    }

    User.findOneAndUpdate(conditions,update,function(error,result){
        if(error){
            console.log(error);
        }else{
            var token = jwt.sign({firstName: update.firstName, lastName: update.lastName, email: update.email,
            username: update.username, postalCode:update.postalCode, lat:update.lat, lng:update.lng, breed:update.breed}, app.get('superSecret'));
            return res.status(200).json({ token: token});
        }
    });
});

/* Use authentication middleware before calling the next function
    next is the function call we want to execute after authentication

    We need to call this function every time the user accesses private info
*/
function verify_authentication(req,res,next){
	var token = req.headers['x-test-header'];
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token return an error
		return res.status(403).json({
			success: false,
			message: 'Not logined in.'
		});
	}
}

/* Example of how you use the verify_authentication
    For understanding and testing purpose
*/
app.get('/get_user_info', verify_authentication, function(req, res) {
    console.log("a");
    console.log(req.decoded);
    res.send({"user": req.decoded});
});

/*Get all users locations  in our database*/
app.get('/get_users_locations', function(req, res) {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            if (user.lat) {
                userMap[user.username] = {"lat": user.lat, "lng": user.lng};
            }
        });
        console.log(userMap);
        res.send(userMap);
    });
});

/*Get all users information who have a breed input in our database*/
app.get('/users', verify_authentication, function(req, res) {
    User.find({}, function(err, users) {
        var alluser = {};

        users.forEach(function(user) {
            if (user.breed) {
				var fullname = user.firstName+" "+user.lastName;

				alluser[user.username] = {
					"name": user.firstName,
					"breed":user.breed,
					"lat": user.lat,
					"lng": user.lng
				};
			}
		});
        res.send(alluser);
    });
});

/*get current logined user location*/
app.get('/curuserloc', verify_authentication, function(req, res) {
	var curr_user = req.decoded;
    res.send({"lat":curr_user.lat,"lng":curr_user.lng});
});

/*Delete current logined user*/
app.delete('/delete_user', verify_authentication, function(req,res){
    var curr_user = req.decoded;
    var conditions = {
        username : curr_user.username
    }
    User.remove((conditions), function(err){
        if(err){
            console.log(err);
            return res.sendStatus(400).end();
        }
        return res.sendStatus(204).end();
    })
});
