(function () {
    'use strict';
    angular.module('ati.customer')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('customer', {
                url: '/ds-khach-hang',
                views: {
                    'content@app': {
                        controller: 'CustomerListController',
                        templateUrl: 'customer/customerList.tpl.html'
                    }
                }
            })
    }
})();