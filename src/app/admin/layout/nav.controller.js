(function () {
    'use strict';

    angular
        .module('ati.admin')
        .controller('navBarController', navBarController)
    ;

    function navBarController($scope) {
        $scope.navigateSidebar = function(type){    
            $scope.stateName = type;
        }
    }
})();