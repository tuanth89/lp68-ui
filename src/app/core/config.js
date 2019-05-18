(function () {
    'use strict';

    angular.module('ati.core')
        .constant('ENTRY_STATE', 'login')
        .config(config)
        .constant('CONTRACT_STATUS', {
            NEW: 0, //Mới
            MATURITY: 1, //Đáo
            STAND: 2, //Lãi Đứng
            COLLECT: 3, //Thu Về
            CLOSE_DEAL: 4, //Chôt
            ESCAPE: 5, //Bễ
            END: 6, // kết thúc chờ kế toán duyệt hết họ
            MATURITY_END: 7, //kết thúc đáo với hợp đồng đáo chờ kế toán duyệt
            ACCOUNTANT_END: 8 //Kế toán xác nhận hợp đồng hết họ
        })
        .constant('IMGUR_API', {
            URL: 'https://api.imgur.com/3/image',
            CLIENT_ID: 'Client-ID 5039840147cebbb'
        })
        .constant('IMGUR_CLIENT_ID', 'Client-ID 5039840147cebbb')
        .constant('CONTRACT_EVENT', {
            UPDATE_SUCCESS: 'UPDATE_SUCCESS',
            RESIZE_TABLE: 'RESIZE_TABLE',
            BLOCKING_UI: 'BLOCKING_UI'
        })
    ;

    function config($httpProvider) {
        $httpProvider.interceptors.push('authTokenInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');
    }
})();