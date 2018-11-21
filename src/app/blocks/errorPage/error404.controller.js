(function () {
    'use strict';

    angular.module('ati.blocks.errorPage')
        .controller('404ErrorController', function(AlertService, $translate) {
            AlertService.replaceAlerts({
                type: 'error',
                message: $translate.instant('ERROR_PAGE.404')
            });
        })
    ;
})();