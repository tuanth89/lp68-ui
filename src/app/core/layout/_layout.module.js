(function () {
    'use strict';

    angular.module('ati.core.layout', [
        'ui.bootstrap',
        'ui.select'
    ])
        .config(function (uiSelectConfig) {
            uiSelectConfig.theme = 'bootstrap';
        }).run(function ($rootScope, adminRestangular) {

        $rootScope.menuItems = [
            {
                title: "Trang chủ",
                featureName: "",
                icon: "c-blue-500 ti-home",
                state: "app.root.dashboard",
                noneDropdown: true,
                visible: true,
                isDefault: true,
            },
            {
                title: "Hợp đồng",
                icon: "c-blue-500 ti-share",
                state: "app.root.contract.cusNew",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Khách hàng",
                icon: "c-blue-500 ti-share",
                state: "app.root.customer",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Tài khoản",
                featureName: "",
                icon: "c-blue-500 ti-user",
                state: "",
                children: [
                    {
                        title: "Nhân viên",
                        featureName: "admin",
                        actions: ["list"],
                        state: ".adminManagement.list"
                    }
                ]
            },
            {
                title: "Tính phế",
                icon: "c-blue-500 ti-share",
                state: "",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Cửa hàng",
                state: "app.root.store.list",
                icon: "c-blue-500 ti-share",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Tỉnh/ TP",
                icon: "c-blue-500 ti-share",
                state: "",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Quận/ Huyện",
                icon: "c-blue-500 ti-share",
                state: "",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Phường/ Xã",
                icon: "c-blue-500 ti-share",
                state: "",
                noneDropdown: true,
                visible: true
            }
        ]
    });
})();