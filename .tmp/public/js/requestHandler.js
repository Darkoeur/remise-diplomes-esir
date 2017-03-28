// Defining a service named Requests to handle the different requests
'use strict';

angular
    .module('RequestHandler', [])
    .factory('Requests', ['$http', '$q', function ($http, $q) {
        var requests = {};
        
        // CREATING A NEW USER THANKS TO THE FORM FILLED
        requests.signupUser = function (prenom, nom, specialite, email, code) {
            var host = '/';
            var defer = $q.defer();
            
            var query = {
                method: 'PUT',
                url: host + 'signup',
                data: {prenom: prenom, nom: nom, email: email, specialite: specialite, code: code}
            };
            
            $http(query).then(function worked(response) {
                // No need to parse, it's already an object
                defer.resolve(response.data)
            }, function failed(serverResponse) {
                var response = {};
                response.success = false;
                response.message = 'Impossible de joindre le serveur'
            });
                            
                            
            return defer.promise;
        };
        
        
        // SIGNIN A USER TO START THE AUTHENTICATION PROCESS
        requests.signinUser = function (email, key) {
            // ajax call here
            
            var host = '/';
            var defer = $q.defer();
            
            var query = {
                method: 'PUT',
                url: host + 'signin',
                data: {email: email, code: key}
            };
            
            // $http.get is asynchronous
            $http(query)
                .then(function worked(response) {
                
                    defer.resolve(response.data);
                
                }, function failed(serverResponse) {
                
                    var givenResponse = {};
                    givenResponse.success = false;
                    givenResponse.message = 'Impossible de joindre le serveur';
                    defer.resolve(givenResponse);
                
                });
    
            return defer.promise;
        };
		
		
		// SIGNOUT A USER FROM THE SERVER
		requests.signoutUser = function() {
			
			var host = '/';
			var defer = $q.defer();
			
			var query = {
				method: 'GET',
				url: host + 'logout'
			};
			
			$http(query)
				.then(function worked(response) {
					defer.resolve(response.data);
				}, function failed(serverResponse) {
					var givenResponse = {};
					givenResponse.success = false;
                    givenResponse.message = 'Impossible de joindre le serveur';
                    defer.resolve(givenResponse);
				});
				
			return defer.promise;
		};
		
		
		// ACTUALIZE INFORMATIONS OF THE CURRENT USER
		requests.refresh = function() {
			
			var host = '/';
			var defer = $q.defer();
			
			var query = {
				method: 'GET',
				url: host + 'refresh'
			};
			
			$http(query)
				.then(function worked(response) {
					console.log(response.data);
					defer.resolve(response.data);
				}, function failed(serverResponse) {
					var givenResponse = {};
					givenResponse.success = false;
                    givenResponse.message = 'Impossible de joindre le serveur';
                    defer.resolve(givenResponse);
				});
				
			return defer.promise;
		};
		
		// CHECK IF THE USER AGENT IS AUTHENTICATED
        requests.checkState = function () {
            
            var host = '/';
            var defer = $q.defer();
            
            var query = {
                method: 'GET',
                url: host + 'state'
            };
			
            $http(query)
                .then(function worked(response) {
                
                    defer.resolve(response.data);
                
                }, function failed(serverResponse) {
                
                    var givenResponse = {};
                    givenResponse.success = false;
					givenResponse.message = 'Impossible de joindre le serveur';
                    defer.resolve(givenResponse);
                
                });
    
            return defer.promise;
        };
		
		requests.changePic = function (file) {
			var host = '/';
			var defer = $q.defer();
			
			var query = {
				method: 'POST',
				url: host + 'upload',
				data: {image:file}
			};
			
			$http(query)
				.then(function worked(response) {
					defer.resolve(response.data);
				}, function failed(serverResponse) {
					var givenResponse = {};
					givenResponse.success = false;
					givenResponse.message = 'Impossible de joindre le serveur';
                    defer.resolve(givenResponse);
				});
				
			return defer.promise;
		};
        
        return requests;
        
    }]);