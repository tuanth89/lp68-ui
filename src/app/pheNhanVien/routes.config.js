(function () {
    'use strict';
    angular.module('ati.pheNv')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('pheNv', {
                abstract: true,
                url: '/phe-nhanvien'
            })
            .state('pheNv.list', {
                url: '/danh-sach?page',
                views: {
                    'content@app': {
                        controller: 'PheNvListController',
                        templateUrl: 'pheNhanVien/pheNvList.tpl.html'
                    }
                },
            })
    }
})();