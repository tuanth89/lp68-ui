(function () {
    'use strict';
    angular.module('ati.customer')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('customer', {
                url: '/customer-list',
                views: {
                    'content@app': {
                        controller: 'CustomerListController',
                        templateUrl: 'customer/customerList.tpl.html'
                    }
                }
            })
    }
})();