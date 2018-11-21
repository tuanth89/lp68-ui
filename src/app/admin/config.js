(function () {
    'use strict';

    angular
        .module('ati.admin')
        .provider('API_ASSISTANT_BASE_URL', {
            $get: function(API_END_POINT) {
                return API_END_POINT + '/v1';
            }
        })
    ;

})();