(function () {
    'use strict';

    angular
        .module('ati.core')
        .factory('adminRestangular', adminRestangular);

    function adminRestangular(Restangular, API_ADMIN_BASE_URL, UserStateHelper) {
        return Restangular.withConfig(function (RestangularConfigurer) {

            RestangularConfigurer.setBaseUrl(API_ADMIN_BASE_URL);
            RestangularConfigurer.setErrorInterceptor(function (response, deferred) {
                if (response.status == 400) 
                {
                    if(response.data.message.startsWith("Cast to ObjectId failed for value") 
                    || response.data.message.startsWith("Skip value must be non-negative")
                    || response.data.message.startsWith("Limit value must be non-negative")
                    ){
                        UserStateHelper.transitionRelativeToBaseState('error.' + 404, {}, { location: 'replace' });
                    }
                    else{
                        toastr.error(response.data.message);
                        return false;
                    }
                } else {
                    return true;
                }
            });

        });
    }
})();