// Defining a service named Responses to handle the responses of the backend
// While it can looks quite useless, i put it in case the application grows

// Maybe could have implemented it into the requestHandler

'use strict';

angular
    .module('ResponseHandler', ['toastr'])
    .factory('Responses', ['toastr', function (toastr) {
        var responses = {};
        
        // The parameter 'response' is expected to contain
        // a boolean 'success' and a string 'message'
        responses.display = function (response) {
            console.log(response);
			if(response.message) {
				if (!response.success) {
					toastr.error('L\'action a échoué.<br/>' + response.message, 'Erreur', {allowHtml: true});
				} else {
					toastr.success(response.message, 'Réussite');
				}	
			}
            
        };
        
        return responses;
        
    }]);