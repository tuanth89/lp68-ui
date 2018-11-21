(function () {
    'use strict';

    angular.module('ati.root', [
        'ati.root.layout',
        'ati.root.dashboard',
        'ati.root.profile'
    ]).run(function($rootScope){
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) { 
            $rootScope.stateName = toState.name;
        })
    });
})();