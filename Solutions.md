# Assignment 3

## Features:
* Our web app allows users to register, login, logout, update their account information, and delete their account. Our (MongoDB) database stores all our registered users' dog breed and basic information, and we use google map to display all our registered users' approximate location (from postal code) so that another dog lover who comes across our web app, can see how many dog owners are around them or in any specific area. We use the IP address API to get the city of our unregistered users so that the map by center around the user by default even if they are not registered. Another feature of our map is to allow users to search for a specific breed of dog, and the search result displays all registered users with that breed of dog ranked by their approximation in distance with our current end user. Right now since we don't have any registered user, the information displayed are randomly made up and the pictures are fetched randomly from the dog API.
Our webapp is developed based on RESTful design with the following functions:

* Where are the dogs API documentation:
* /register (POST): Creates a new user in API database based on given user's first name, last name, email, username, password, postal code and a selected dog breed.
* /authenticate (POST): Authorizes a registered user with their given userane and password credentials and assigns a unique token that allows them to do privelaged actions in API
* /update (PUT): Allows the user to update their personal information including name, email, address, postal code and breed based on a form input
* /get_user_info (GET): Returns the current signed in user information in JSON format with first name, last name, email, username, postal code, location (latitude and longtitude) and breed
* /get_users_locations (GET): Returns JSON format of all registered user's location in latitude and longtitude
* /users (GET) : Returns all regestered users' first name, breed, and location in latitude and longtitude
* /curuserloc (GET): Returns current logged in user's location in latitude and longtitude
* /delete_user (DELETE): Removes current user's information from API and database


## Roles of Our End Users and How They Can Use Our App
* Since this web app is for curiosity and social purposes, our end users can be any random person who is just interested in knowing how many dog owners around them or they can be serious dog lovers who want to meet with other dog owners that have breeds similar to their own dog's energy level and play style. All our users have to do is signup on our page if that haven't done so already. All users are given the priviledge to search for specific breeds of dogs near them that is also registered on our database using our search feature. They also have the ability to update their information when needs be. With our webapp, they can gain the knowledge of the distribution of dog breeds in the area around them with the information of the breed of the dog, a picture of the dog, the owner of the dog and the distance listed in ascending order. Moreover, with the use of marker clustering with the google map API, they are allowed to see the number of registered dog users on the map to see the number of users within an area. 

## Limitations
* Sometimes our POST/PUT methods to our own backend API will fail to load due to internal server issues. During times like this the user needs to exit the browser and try again. In theory these methods should function as documentation mentioned, we suspect it the the hosting server end's issue which we are limited to offer other improvements to the problem.
* As of now users cannot connect with each other through our application, due to time constraints we couldn't build this feature into our webapp. If we further build upon it, users will be able to connect with each other and potentially meet up and arrange meetings with other dog lovers. 
