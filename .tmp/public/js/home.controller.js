'use strict';

/*
    Controller used only to go to the next step after 2 sec
*/

angular
    .module('app')
    .controller('homeController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
        $scope.working = 'This website is powered by Angular.';
        $scope.year = 2017;
    
        // Maybe check if the user-agent is not logged already ?

        $timeout(function () {
            $location.path('/go');
        }, 2000);
    }]);