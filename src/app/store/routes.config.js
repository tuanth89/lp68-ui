(function () {
    'use strict';
    angular.module('ati.store')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('store', {
                abstract: true,
                url: '/cua-hang'
            })
            .state('store.list', {
                url: '/danh-sach?page',
                views: {
                    'content@app': {
                        controller: 'StoreListController',
                        templateUrl: 'store/storeList.tpl.html'
                    }
                },
            })
            .state('store.new', {
                url: '/tao-moi',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            })
            .state('store.edit', {
                url: '/chinh-sua/:id',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            })
            .state('store.detail', {
                url: '/chi-tiet/:id',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            });
    }
})();