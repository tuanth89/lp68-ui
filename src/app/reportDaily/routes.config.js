(function () {
    'use strict';
    angular.module('ati.reportDaily')
        .config(addStates);

    function addStates(UserStateHelperProvider) {
        UserStateHelperProvider
            .state('reportDaily', {
                abstract: true,
                url: '/bao-cao-ngay'
            })
            .state('reportDaily.list', {
                url: '/danh-sach?page',
                views: {
                    'content@app': {
                        controller: 'ReportDailyController',
                        templateUrl: 'reportDaily/reportDaily.tpl.html'
                    }
                },
                onEnter: function (blockUIConfig) {
                    blockUIConfig.autoBlock = true;
                },
                onExit: function (blockUIConfig) {
                    blockUIConfig.autoBlock = false;
                }
            })
    }
})();