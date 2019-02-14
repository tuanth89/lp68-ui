(function () {
    'use strict';
    angular.module('ati.pheConfig')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('pheConfig', {
                url: '/cau-hinh-phe',
                views: {
                    'content@app': {
                        controller: 'PheConfigController',
                        templateUrl: 'pheConfig/pheConfig.tpl.html'
                    }
                }
            })
            .state('pheConfig.newCustomer', {
                url: '/khach-moi',
                views: {
                    'content@app.root.pheConfig': {
                        controller: 'PheKhachMoiController',
                        templateUrl: 'pheConfig/khachMoi/pheKhachMoi.tpl.html'
                        // resolve: {
                        //     contracts: function($stateParams, ContractManager) {
                        //         return ContractManager.one('allContract').one('byType').getList("",{type: 1});
                        //     }
                        // }
                    }
                }
            })
            .state('pheConfig.oldCustomer', {
                url: '/khach-cu',
                views: {
                    'content@app.root.pheConfig': {
                        controller: 'PheKhachCuController',
                        templateUrl: 'pheConfig/khachCu/pheKhachCu.tpl.html'
                    }
                }
            })
    }
})();