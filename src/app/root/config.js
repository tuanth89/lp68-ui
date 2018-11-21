(function () {
    'use strict';

    angular
        .module('ati.root')
        .provider('API_ADMIN_BASE_URL', {
            $get: function(API_END_POINT) {
                return API_END_POINT + '/admin/v1';
            }
        })
    ;

})();