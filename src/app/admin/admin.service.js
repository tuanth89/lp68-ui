(function () {
    'use strict';
    angular
        .module('ati.admin')
        .factory('AdminService', Service);

    function Service($rootScope, adminRestangular) {
        $rootScope.countInfo = {
            requestUnReadCount: 0,
            newCourseCount: 0,
        };
        $rootScope.favicon = localStorage.getItem("favicon") ? localStorage.getItem("favicon"): null;
     
        // let getRequestUnReadCount = function () {
        //     adminRestangular.all("requests/countUnRead").customGET().then(function (resp) {
        //         $rootScope.countInfo.requestUnReadCount = resp;
        //     });
        // }
        //
        // let getNewCourseCount = function () {
        //     adminRestangular.all("courses").customGET("newCount").then(function (resp) {
        //         $rootScope.countInfo.newCourseCount = resp;
        //     });
        // }
        //
        // let getNewNotification = function () {
        //     let filter = {
        //         per_page: 1000000,
        //         page: 1,
        //         read: false,
        //         types: ["SEND_APPROVAL_COURSE"]
        //     }
        //     adminRestangular.all("system-notifications").post(filter).then(function (resp) {
        //         // //console.log(resp.docs[0])
        //         $rootScope.systemNotifications = {
        //             list: resp.docs,
        //             total: resp.total
        //         }
        //         $rootScope.systemNotifications.list.map(item => {
        //             item.createdAt = timeSince(new Date(item.createdAt));
        //         })
        //     });
        // }
        // // lấy ảnh favicon
        // let favicon = function () {
        //
        //     adminRestangular.all("/footer-config").customGET("").then(function (resp) {
        //         if (resp.logoConfig.faviconImage) {
        //
        //             $rootScope.favicon = resp.logoConfig.faviconImage;
        //             localStorage.setItem("favicon",$rootScope.favicon);
        //         }
        //
        //     });
        // }
        // let getNewNotificationCount = function () {
        //     let filter = {
        //
        //         read: false,
        //         types: ["SEND_APPROVAL_COURSE"]
        //     }
        //     adminRestangular.all("system-notifications/count").post(filter).then(function (resp) {
        //         //console.log("count", resp);
        //         $rootScope.systemNotificationsCount = resp;
        //
        //     });
        // }
        //
        // let getFeatureAccessByCurentRole = function () {
        //     return new Promise(function (resolve, reject) {
        //         adminRestangular.all("feature-access").customGET("getByCurrentUser").then(function (resp) {
        //             let features = resp.plain();
        //             let routeNames = [];
        //
        //             features.forEach(item => {
        //                 routeNames = _.union(routeNames, item.routeNames);
        //             });
        //
        //             $rootScope.routeNames = routeNames;
        //
        //             resolve(routeNames);
        //         }).catch(err => {
        //             reject(err);
        //         })
        //     })
        // }

        /**
         * chuyển thời gian về dạng xxx trước
         * @param {*} date 
         */
        function timeSince(date) {

            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " năm trước";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " tháng trước";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " Ngày trước";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " giờ trước";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " phút trước";
            }
            return "Vừa xong";
        }
        // /**
        //  * Cập nhật menu ứng với người dùng hiện tại
        //  * @param {*} routeNames
        //  */
        // function updateMenuItemsData(routeNames) {
        //     $rootScope.menuItems.forEach(menuItem => {
        //         if (!menuItem.isDefault) {
        //             menuItem.visible = false;
        //         }
        //         if (menuItem.children) {
        //             menuItem.children.forEach(child => {
        //                 child.visible = false;
        //                 child.actions.forEach(menuAction => {
        //                     let featureNames = child.featureName.split(",");
        //                     featureNames.forEach(f => {
        //                         if (routeNames.indexOf(f + "." + menuAction) >= 0) {
        //                             child.visible = true;
        //                         }
        //                     });
        //                 })
        //             });
        //
        //             if (_.countBy(menuItem.children, i => i.visible).true > 0) {
        //                 menuItem.visible = true;
        //             }
        //         }
        //     })
        // }
        //
        // /**
        //  * Kiểm tra người dùng có quyền truy cập vào 1 trong các routeNames hay không
        //  * @param {*} routeNames
        //  */
        // function hasRouteNames(routeNames) {
        //     let hasPermission = false;
        //     routeNames.forEach(name => {
        //         if ($rootScope.routeNames.indexOf(name) >= 0) {
        //             hasPermission = true;
        //         }
        //     });
        //
        //     return hasPermission;
        // }
        //
        // /**
        //  * Cập nhật thông tin sidebar
        //  */
        // function updateSidebar() {
        //     getFeatureAccessByCurentRole().then(function (routeNames) {
        //         updateMenuItemsData(routeNames);
        //         $rootScope.$apply();
        //     })
        // }

        let init = function () {
            // favicon();
            // updateSidebar();
            // getNewNotification();
            // getNewNotificationCount();
            // getRequestUnReadCount();
            // getNewCourseCount();
        }

        return {
            // favicon,
            init,
            // getNewNotification,
            // getRequestUnReadCount,
            // getNewCourseCount,
            // getNewNotificationCount,
            // hasRouteNames,
            // getFeatureAccessByCurentRole
        }
    }

})();