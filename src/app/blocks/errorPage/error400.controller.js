(function () {
    'use strict';

    angular.module('ati.blocks.errorPage')
        .controller('400ErrorController', function(AlertService, $translate) {
            AlertService.replaceAlerts({
                type: 'error',
                message: $translate.instant('ERROR_PAGE.400')
            });
        })
    ;
})();