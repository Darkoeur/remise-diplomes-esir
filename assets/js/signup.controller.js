'use strict';

/*
    This controller will :
        - check data to avoid useless submit button clicks
        - treat the answer of the backend properly
*/

angular
    .module('app')
    .controller('signupController', ['$scope', '$location', 'toastr', 'Requests', 'Responses', function($scope, $location, toastr, Requests, Responses) {
        $scope.working = 'This website is powered by Angular.';
    
        // Submit function of the form
        $scope.create = function(){
            var promise = Requests.signupUser(prenom.value, nom.value, specialite.value, email.value, code.value);
            
            promise.then(function resolved(result){
                Responses.display(result);
                
                if(result.success){
                    console.log('We go to the next step now');
                    $location.path('/connect');
                }
            }, function failed(result) {});
        };
        
        
        // TODO : Verify if the user-agent is not logged yet
    
        
    
        // TODO : Add the request to the server and the callback
    }]);