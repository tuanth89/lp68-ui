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
                state: ".dashboard",
                noneDropdown: true,
                visible: true,
                isDefault: true
            },
            {
                title: "Hợp đồng",
                icon: "c-blue-500 ti-briefcase",
                state: ".contract.cusNew",
                noneDropdown: true,
                visible: true,
                featureName: "contract",
                actions: ["list"]
            },
            {
                title: "Khách hàng",
                icon: "c-blue-500 ti-user",
                state: ".customer",
                noneDropdown: true,
                visible: true,
                featureName: "customer",
                actions: ["list"]
            },
            {
                title: "Tài khoản",
                featureName: "admin",
                icon: "c-blue-500 ti-user",
                state: ".adminManagement.list",
                noneDropdown: true,
                visible: true,
                actions: ["list"]
            },
            {
                title: "Thống kê",
                icon: "c-blue-500 ti-stats-up",
                state: "",
                noneDropdown: true,
                visible: true,
                featureName: "statistic",
                actions: ["list"]
            },
            {
                title: "Cấu hình phế",
                icon: "c-blue-500 ti-money",
                state: ".pheConfig.newCustomer",
                noneDropdown: true,
                visible: true,
                featureName: "tinhphe",
                actions: ["list"]
            },
            {
                title: "Cửa hàng",
                state: ".store.list",
                icon: "c-blue-500 ti-list",
                noneDropdown: true,
                visible: true,
                featureName: "store",
                actions: ["list"]
            },
            {
                title: "Phân quyền",
                featureName: "role",
                actions: ["list"],
                state: ".role.list",
                icon: "c-blue-500 ti-list",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Tỉnh/ TP",
                icon: "c-blue-500 ti-list",
                state: "",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Quận/ Huyện",
                icon: "c-blue-500 ti-list",
                state: "",
                noneDropdown: true,
                visible: true
            },
            {
                title: "Phường/ Xã",
                icon: "c-blue-500 ti-list",
                state: "",
                noneDropdown: true,
                visible: true
            }
        ]

    });
})();