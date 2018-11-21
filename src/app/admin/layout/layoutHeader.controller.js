(function () {
    'use strict';

    angular
        .module('ati.admin')
        .controller('LayoutAdminHeader', LayoutAdminHeader);

    function LayoutAdminHeader($scope, autoLogin) {
        $scope.switchBackToAdminAccount = switchBackToAdminAccount;
        $scope.showButtonSwitchBackToAdmin = showButtonSwitchBackToAdmin;

        function switchBackToAdminAccount() {
            autoLogin.switchBackMyAccount('app.admin.usersManagement.assistants.list');
        }

        function showButtonSwitchBackToAdmin() {
            return autoLogin.showButtonSwitchBack();
        }
    }
})();