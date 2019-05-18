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
                icon: "c-deep-orange-500 ti-briefcase",
                state: ".contract.contractNew",
                noneDropdown: true,
                visible: true,
                featureName: "contract",
                actions: ["list"]
            },
            {
                title: "Khách hàng",
                icon: "c-light-blue-500 ti-id-badge",
                state: ".customer.cusInput",
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
            // {
            //     title: "Thống kê",
            //     icon: "c-blue-500 ti-stats-up",
            //     state: "",
            //     noneDropdown: true,
            //     visible: true,
            //     featureName: "statistic",
            //     actions: ["list"]
            // },
            {
                title: "Cấu hình phế",
                icon: "c-pink-500 ti-money",
                state: "",
                featureName: "",
                actions: ["list"],
                children: [
                    {
                        title: "Nhân viên",
                        featureName: "contract",
                        actions: ["list"],
                        state: ".pheNv.list"
                    },
                    {
                        title: "Cấu hình phế",
                        featureName: "pheConfig",
                        actions: ["list"],
                        state: ".pheConfig.newCustomer"
                    }
                ]
            },
            {
                title: "Cửa hàng",
                state: ".store.list",
                icon: "c-blue-500 ti-view-list",
                noneDropdown: true,
                visible: true,
                featureName: "store",
                actions: ["list"]
            },
            {
                title: "Báo cáo",
                state: ".reportDaily.list",
                icon: "c-red-500 ti-view-grid",
                noneDropdown: true,
                visible: true,
                featureName: "reportDaily",
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