(function () {
    'use strict';
    angular.module('ati.contract')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('contract', {
                abstract: true,
                url: '/contract',
                views: {
                    'content@app': {
                        controller: 'ContractController',
                        templateUrl: 'contract/contract.tpl.html'
                    }
                },
            })
            .state('contract.cusNew', {
                url: '/customer-new',
                views: {
                    'content@app.root.contract': {
                        controller: 'CustomerNewController',
                        templateUrl: 'contract/customerNew.tpl.html'
                    }
                }
            })
            .state('contract.cusCirculation', {
                url: '/customer-circulation',
                views: {
                    'content@app.root.contract': {
                        controller: 'CustomerCirculationController',
                        templateUrl: 'contract/customerCirculation.tpl.html'
                    }
                },
                resolve: {
                    contracts: function (ContractManager) {
                        return ContractManager.one("circulation").one("all").getList();
                    }
                }
            })
    }
})();