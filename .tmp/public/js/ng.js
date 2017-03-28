'use strict';

// Our global application module, asking for dependency injections
angular
    .module('app', ['ngFileUpload', 'ngRoute', 'ngAnimate', 'ngStorage', 'toastr', 'RequestHandler', 'ResponseHandler'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'includes/home.html',
                controller: 'homeController',
                public: true
            })
            .when('/home', {
                templateUrl: 'includes/home.html',
                controller: 'homeController',
                public: true
            })
            .when('/go', {
                templateUrl: 'includes/signup.html',
                controller: 'signupController',
                public: true
            })
            .when('/connect', {
                templateUrl: 'includes/signin.html',
                controller: 'signinController',
                public: true
            })
            .when('/profil', {
                templateUrl: 'includes/profil.html',
                controller: 'profilController',
                public: false
            })
            .otherwise({
                templateUrl: 'includes/notfound.html',
                controller: 'voidController',
                public: true
            });

        })
    .run(['$rootScope', '$sessionStorage', '$location', 'toastr', 'Requests', function($rootScope, $sessionStorage, $location, toastr, Requests) {
		
		
		// Sync the client state authentication with the server one
		var state = Requests.checkState();
		
		state.then(function resolved(result) {
			
                if (result.success) {
                    $sessionStorage.token = result.token;
                } else {
					$sessionStorage.token = null;
					if($location.path() == '/profil'){
						$location.path('/connect');
					}
				}
                
            }, function failed(result) {});
		
        $rootScope.$on("$locationChangeStart", function(evt, next, current) {
           console.log('Changement de route amorcé..');
            if ($sessionStorage.token == null){
                
               if (next.includes('profil')) {
                   toastr.error('Vous devez vous connecter.');
                   $location.path('/connect');
               }
           } else {
               if (!next.includes('profil')) {
                   toastr.info('Vous êtes déjà connecté !');
                   $location.path('/profil');
               }
           } 
            console.log('token de session : ' + $sessionStorage.token);
        });
    }]);

