*remise-diplomes-esir*

The project includes two parts, the frontend and the backend.
The application will allow users to leave comments on the profiles of their
friends, to change their profile pic and other things.
The goal would be to display the data collected during the graduating ceremony.

---------------------------

Tasks done :

	FRONT (JavaScript/AngularJS 1, HTML, CSS/Bootstrap)
	
		- Creation of a module
		- Controllers for each part of the app (Signup, Signin, Profile, Main)
		- Responsive templates
		- Two services, one for handling the requests and one for the responses
		- Toastr module added for displaying popup informations
		- Session handling
		
	BACK (Nodejs/Sails.js - MVC framework build over the top of Express)
	
		- Database structure (configuration of models: User, Profil, Comment)
		- Controllers, one per model
		- Routing (association of routes with a corresponding controller action)
		- Bootstrap (insert data on server launch)
		- Session handling
		- Model validation messages gestion with *sails-hook-validation*
		
I'm trying to follow as much as possible rules listed here :
	https://github.com/johnpapa/angular-styleguide/blob/master/a1/
In order to get a code clean

The security part has been clearly reported since the app itself is not sure to be published officialy.

I'm writing this README on the 19/03/2017, and have started the project there is less than a week after a job interview.

Don't hesitate to contact me, I would enjoy feedbacks

---------------------------

To launch the project :

- > npm install sails

- > cd projectCloned

- > npm install

- > sails lift --debug

- And it should work ! Go to localhost:1337/