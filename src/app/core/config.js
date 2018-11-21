(function () {
    'use strict';

    angular.module('ati.core')
        .constant('ENTRY_STATE', 'login')
        .config(config)
        .constant('STATUS_PATIENT', {
            waiting: 1,
            skip: 2,
            preHealthCheck: 3,
            preHealthCheckComplete: 4,
            healthCheck: 5,
            completed: 6
        })
        .constant('STATUS_PATIENT_TEXT', {
            1: 'Waiting',
            2: 'Skip',
            3: 'Pre-Health Check',
            4: 'Pre-Health Check Complete',
            5: 'Health Check',
            6: 'Health Check completed'
        })
        .constant('SPECIAL_CHARACTER_PATTERN', /[`~<>:"/[\]|{}()=+]/)
    ;

    function config($httpProvider) {
        $httpProvider.interceptors.push('authTokenInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');
    }
})();