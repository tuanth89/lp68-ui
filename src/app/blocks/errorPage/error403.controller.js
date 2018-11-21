(function () {
    'use strict';

    angular.module('ati.blocks.errorPage')
        .controller('403ErrorController', function(AlertService, $translate) {
            AlertService.replaceAlerts({
                type: 'error',
                message: $translate.instant('ERROR_PAGE.403')
            });
        })
    ;
})();