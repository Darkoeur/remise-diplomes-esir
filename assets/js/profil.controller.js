'use strict';

/*
    This controller will load the current logged user
    Plus give him an access to the searching tool
*/

angular
    .module('app')
    .controller('profilController', profil);

function profil($sessionStorage, $scope, $location, toastr, Requests, Responses) {
    
    // Initialization to be done here..

    $scope.searching = false;
    $scope.navigating = false;
	
	var promise = Requests.refresh();
	
	promise.then(function resolved(result) {
                Responses.display(result);
                if (result.success) {
                    $scope.me = result.data;
                }
                
        }, function failed(result) {});
			
			
			
	// BUTTON AND MENU ACTIONS BELOW

    // Action associated with the searching button
    $scope.switchSearching = function () {
        // Can't navigate and search at the same time
        if(!$scope.navigating){
            $scope.searching = !$scope.searching;
            if ($scope.searching) {
                document.querySelector('.content-row').style.transform = 'scale(0.8)';
            } else {
                document.querySelector('.content-row').style.transform = 'scale(1)';
            }
        } else {
            toastr.info('Le menu est ouvert');
        }
        
    };
    
    // Action for the navigation menu
    $scope.switchNavigating = function () {
        // Can't navigate and search at the same time
        if(!$scope.searching){
            $scope.navigating = !$scope.navigating;
            if($scope.navigating) document.querySelector('.navigate-button').style.position = 'fixed';
        }
    };
    
    // Function saying to the server to suppress our stored session
    $scope.logout = function () {
		
		var promise = Requests.signoutUser();

		promise.then(function resolved(result) {
                Responses.display(result);
                if (result.success) {
                    $sessionStorage.token = null;
                    $location.path('/connect');
                }
                
            }, function failed(result) {});
        
    };
    
}