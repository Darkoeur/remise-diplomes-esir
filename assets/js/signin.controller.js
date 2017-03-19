'use strict';

/*
    This controller will (like the signup one) :
        - check data to avoid useless submit button clicks
        - treat the answer of the backend properly
*/

angular
    .module('app')
    .controller('signinController', ['$rootScope', '$scope', '$location', '$sessionStorage', 'toastr', 'Requests', 'Responses', function($routeScope, $scope, $location, $sessionStorage, toastr, Requests, Responses) {
        $scope.working = 'This website is powered by Angular.';
        
        $scope.submit = function(){
            var promise = Requests.signinUser(email.value, code.value);
            
            // Result object is a JSON with two components
            // - a boolean "success"
            // - a string "message"
            
            promise.then(function resolved(result) {
                Responses.display(result);
                if (result.success) {
                    $sessionStorage.token = result.token;
                    $location.path('/profil');
                }
                
            }, function failed(result) {});
        };
    }]);