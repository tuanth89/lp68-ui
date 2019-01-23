(function () {
    'use strict';
    angular.module('ati.store')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('store', {
                abstract: true,
                url: '/store'
            })
            .state('store.list', {
                url: '/list?page',
                views: {
                    'content@app': {
                        controller: 'StoreListController',
                        templateUrl: 'store/storeList.tpl.html'
                    }
                },
            })
            .state('store.new', {
                url: '/new',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            })
            .state('store.edit', {
                url: '/edit/:id',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            })
            .state('store.detail', {
                url: '/detail/:id',
                views: {
                    'content@app': {
                        controller: 'StoreFormController',
                        templateUrl: 'store/storeForm.tpl.html'
                    }
                },
            });
    }
})();