(function () {
    'use strict';
    angular.module('ati.customer')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('customer', {
                abstract: true,
                url: '/khach-hang',
                views: {
                    'content@app': {
                        controller: 'CustomerParentController',
                        templateUrl: 'customer/parent.tpl.html'
                    }
                }
            })
            .state('customer.cusInput', {
                url: '/nhap-khach',
                views: {
                    'content@app.root.customer': {
                        controller: 'CustomerInputController',
                        templateUrl: 'customer/nhapKhach/customerInput.tpl.html'
                    }
                },
                resolve: {
                    customerSource: function ($stateParams, CustomerManager, Auth) {
                        return CustomerManager.one('list').one('autoComplete').getList("", {storeId: Auth.getSession().selectedStoreId, userId: Auth.getSession().selectedUserId});
                    }
                }
            })
            .state('customer.cusInfo', {
                url: '/thong-tin-khach',
                views: {
                    'content@app.root.customer': {
                        controller: 'CustomerListController',
                        templateUrl: 'customer/customerList.tpl.html'
                    }
                }
            })
    }
})();