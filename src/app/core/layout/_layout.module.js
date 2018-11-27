(function () {
    'use strict';

    angular.module('ati.core.layout', [
            'ui.bootstrap',
            'ui.select'
        ])
        .config(function (uiSelectConfig) {
            uiSelectConfig.theme = 'bootstrap';
        }).run(function ($rootScope, adminRestangular) {

            $rootScope.menuItems = [{
                    title: "Trang chủ",
                    featureName: "",
                    icon: "c-blue-500 ti-home",
                    state: "app.root.dashboard",
                    noneDropdown: true,
                    visible: true,
                    isDefault: true,
                },
                {
                    title: "Khách hàng",
                    icon: "c-blue-500 ti-share",
                    state: "app.root.contract.cusNew",
                    noneDropdown: true,
                    visible: true
                },
                {
                    title: "Nhân viên",
                    icon: "c-blue-500 ti-share",
                    state: "",
                    noneDropdown: true,
                    visible: true
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
                    icon: "c-blue-500 ti-share",
                    state: "",
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
                },
                // {
                //     title: "Danh mục cấp 2",
                //     featureName: "",
                //     icon: "c-blue-500 ti-menu-alt",
                //     state: "",
                //     children: [{
                //             title: "Danh sách",
                //             featureName: "subCategory",
                //             actions: ["list"],
                //             state: ".subcategory.list"
                //         },
                //         {
                //             title: "Thêm mới",
                //             featureName: "subCategory",
                //             actions: ["create"],
                //             state: ".subcategory.new"
                //         }
                //     ]
                // },

                // {
                //     title: "Khóa học",
                //     featureName: "",
                //     icon: "c-blue-500 ti-book",
                //     state: "",
                //     children: [
                //         {
                //             title: "Danh mục cấp 1",
                //             featureName: "subCategory",
                //             actions: ["list"],
                //             state: ".category.list"
                //         },
                //         {
                //             title: "Danh mục cấp 2",
                //             featureName: "subCategory",
                //             actions: ["list"],
                //             state: ".subcategory.list"
                //         },
                //         {
                //             title: "Danh sách khoá học",
                //             featureName: "course",
                //             actions: ["list"],
                //             state: ".course.lecturerList",
                //             countNumber: "newCourseCount"
                //         },
                //         {
                //             title: "Danh sách chứng nhận hoàn thành khóa học",
                //             featureName: "certificate",
                //             actions: ["list"],
                //             state: ".certificate.list"
                //         },
                //         {
                //             title: "Báo cáo vi phạm",
                //             featureName: "violateReport",
                //             actions: ["list"],
                //             state: ".violateReport.list"
                //         }
                //     ]
                // },
                // {
                //     title: "Tài khoản",
                //     featureName: "",
                //     icon: "c-blue-500 ti-user",
                //     state: "",
                //     children: [{
                //         title: "Tài khoản hệ thống",
                //         featureName: "admin",
                //         actions: ["list"],
                //         state: ".accountantManagement.list"
                //     },
                //     {
                //             title: "Học viên",
                //             featureName: "student",
                //             actions: ["list"],
                //             state: ".studentManagement.list"
                //         },
                //         {
                //             title: "Giảng viên",
                //             featureName: "lecturer",
                //             actions: ["list"],
                //             state: ".lecturerManagement.list"
                //         }
                //     ]
                // },
                // {
                //     title: "Tài chính",
                //     featureName: "",
                //     icon: "c-blue-500 ti-credit-card",
                //     state: "",
                //     children: [{
                //             title: "Ship COD",
                //             featureName: "shipCode",
                //             actions: ["list"],
                //             state: ".shipCOD.list"
                //         },
                //         {
                //             title: "Lịch sử thanh toán",
                //             featureName: "paymentHistory",
                //             actions: ["list"],
                //             state: ".paymentHistory.list"
                //         }
                //     ]
                // },
                // {
                //     title: "Marketing",
                //     featureName: "",
                //     icon: "c-blue-500 ti-gift",
                //     state: "",
                //     children: [{
                //             title: "Chương trình khuyến mại",
                //             featureName: "promotion",
                //             actions: ["list"],
                //             state: ".promotions.list"
                //         },
                //         {
                //             title: "Voucher",
                //             featureName: "voucher",
                //             actions: ["list"],
                //             state: ".voucher.list"
                //         },
                //         {
                //             title: "Quản lý nhận email",
                //             featureName: "mail",
                //             actions: ["list"],
                //             state: ".mail.list"
                //         },
                //
                //         {
                //             title: "Danh sách nhận email",
                //             featureName: "email",
                //             actions: ["list"],
                //             state: ".emailManagement.list"
                //         },
                //         {
                //             title: "Danh sách thư góp ý",
                //             featureName: "request",
                //             actions: ["list"],
                //             state: ".feedback.list",
                //             countNumber: "requestUnReadCount"
                //
                //         },
                //         {
                //             title: "Thông báo cho học viên",
                //             featureName: "studentNotification",
                //             actions: ["list"],
                //             state: ".studentNotification.list"
                //         },
                //         {
                //             title: "Thông báo cho giảng viên",
                //             featureName: "lecturerNotification",
                //             actions: ["list"],
                //             state: ".lecturerNotification.list"
                //         }
                //     ]
                // },
                //
                //
                // {
                //     title: "Cấu hình",
                //     featureName: "",
                //     icon: "c-blue-500 ti-settings",
                //     state: "",
                //     children: [ {
                //         title: "Cấu hình Logo",
                //         featureName: "logo",
                //         actions: ["list"],
                //         state: ".webConfig.header"
                //     },
                //     {
                //         title: "Quản lý Footer",
                //         featureName: "footer",
                //         actions: ["list"],
                //         state: ".webConfig.footer.list"
                //     },
                //     {
                //             title: "Banner trang chủ",
                //             featureName: "banner",
                //             actions: ["list"],
                //             state: ".banner.homeList"
                //         },
                //         {
                //             title: "Khóa học ngoài trang chủ",
                //             featureName: "homeCourse",
                //             actions: ["list"],
                //             state: ".visibleCourseConfig"
                //         },
                //         {
                //             title: "Nhận xét của khách hàng",
                //             featureName: "customerReview",
                //             actions: ["list"],
                //             state: ".customerReview.list"
                //         },
                //
                //         {
                //             title: "Danh sách đối tác",
                //             featureName: "partner",
                //             actions: ["list"],
                //             state: ".partner.list"
                //         },
                //         {
                //             title: "Thư viện ảnh",
                //             featureName: "imageGallery",
                //             actions: ["list"],
                //             state: ".image.list"
                //         },
                //         {
                //             title: "Cấu hình chung",
                //             featureName: "paymentMethod,vat,rose",
                //             actions: ["list"],
                //             state: ".systemConfig.paymentMethod"
                //         },
                //
                //         {
                //             title: "Câu hỏi thường gặp",
                //             featureName: "frequentQuestion",
                //             actions: ["list"],
                //             state: ".faq.list"
                //         },
                //         {
                //             title: "Phân quyền",
                //             featureName: "role",
                //             actions: ["list"],
                //             state: ".role.list"
                //         },
                //
                //     ]
                // },
                // {
                //     title: "Báo cáo",
                //     featureName: "",
                //     icon: "c-blue-500 ti-bar-chart",
                //     state: "",
                //     children: [{
                //             title: "Báo cáo số lượng khóa học",
                //             featureName: "numberCourse",
                //             actions: ["list"],
                //             state: ".report.courseByTime"
                //         },
                //         {
                //             title: "Báo cáo số lượng học viên theo khóa học",
                //             featureName: "studentByCourse",
                //             actions: ["list"],
                //             state: ".report.studentByCourse"
                //         },
                //         {
                //             title: "Báo cáo số lượng học viên theo danh mục",
                //             featureName: "studentByCategory",
                //             actions: ["list"],
                //             state: ".report.studentByCourse"
                //         },
                //         {
                //             title: "Báo cáo số lượng tài khoản mới",
                //             featureName: "newAccount",
                //             actions: ["list"],
                //             state: ".report.newStudent"
                //         },
                //         {
                //             title: "Báo cáo doanh thu",
                //             featureName: "revenue",
                //             actions: ["list"],
                //             state: ".report.revenue"
                //         },
                //         {
                //             title: "Báo cáo doanh thu theo khóa học",
                //             featureName: "revenueByCourse",
                //             actions: ["list"],
                //             state: ".report.revenueByCourse"
                //         },
                //         {
                //             title: "Báo cáo doanh thu theo danh mục",
                //             featureName: "revenueByCategory",
                //             actions: ["list"],
                //             state: ".report.revenueByCategory"
                //         },
                //         {
                //             title: "Báo cáo kết quả thi theo tháng",
                //             featureName: "resultByMonth",
                //             actions: ["list"],
                //             state: ".report.resultByMonth"
                //         },
                //         {
                //             title: "Đối soát Medu với giảng viên",
                //             featureName: "doisoatGiangVien",
                //             actions: ["list"],
                //             state: ".report.resultByMonth"
                //         },
                //         {
                //             title: "Đối soát Medu với VNPAY",
                //             featureName: "doisoatVNPAY",
                //             actions: ["list"],
                //             state: ".report.resultByMonth"
                //         },
                //     ]
                // },
            ]
        });
})();