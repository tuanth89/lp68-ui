(function () {
    'use strict';

    angular.module('ati.core.layout')
        .controller('AppController', App)
        .directive('bindHtmlCompile', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        return scope.$eval(attrs.bindHtmlCompile);
                    }, function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    });
                }
            };
        }]);
    ;

    function App($rootScope, $scope, Auth, userSession, $timeout, blockUI, AUTH_EVENTS, RELOAD_PAGE, LANG_KEY, storeList, Restangular, CONTRACT_EVENT, StoreManager) {
        $scope.storeList = angular.copy(Restangular.stripRestangular(storeList));
        $scope.currentUser = userSession;
        $scope.isRoot = Auth.isRoot();
        $scope.isAccountant = Auth.isAccountant();
        $scope.usersByStore = [];
        $scope.titleModal = "Chọn cửa hàng";
        $scope.step = 1;
        $scope.newUsers = [];

        $scope.formStoreProcessing = false;
        $scope.storeSelected = {storeId: "", userId: "", userCode: "", userName: "", storeName: ""};
        $scope.storeSelected.storeId = $scope.currentUser.selectedStoreId;
        $scope.storeSelected.storeName = $scope.currentUser.selectedStoreName;
        $scope.storeSelected.userId = $scope.currentUser.selectedUserId;
        $scope.storeSelected.userCode = $scope.currentUser.selectedUserCode;
        $scope.storeSelected.userName = $scope.currentUser.selectedUserName;

        $scope.storeDraff = {storeId: "", userId: "", userCode: "", userName: "", storeName: ""};
        $scope.allowClose = false;

        if (!$scope.currentUser.selectedStoreId && !$scope.isRoot) {
            $('#storeModal').modal({show: true, backdrop: 'static', keyboard: false});
        } else
            $scope.storeDraff = angular.copy($scope.storeSelected);

        $scope.selectedStoreEvent = function (item) {
            // $scope.storeSelected.storeId = item._id;
            // $scope.storeSelected.storeName = item.name;
            $scope.storeDraff.storeId = item._id;
            $scope.storeDraff.storeName = item.name;

            if (!$scope.isAccountant) {
                // $scope.storeSelected.userId = $scope.currentUser.id;
                // $scope.storeSelected.userCode = $scope.currentUser.username;
                // $scope.storeSelected.userName = $scope.currentUser.fullName;

                $scope.storeDraff.userId = $scope.currentUser.id;
                $scope.storeDraff.userCode = $scope.currentUser.username;
                $scope.storeDraff.userName = $scope.currentUser.fullName;
            } else {
                // $scope.storeSelected.userId = "";
                // $scope.storeSelected.userCode = "";
                // $scope.storeSelected.userName = "";

                $scope.storeDraff.userId = "";
                $scope.storeDraff.userCode = "";
                $scope.storeDraff.userName = "";

                StoreManager.one(item._id).one('listUserByStore').get()
                    .then((store) => {
                        $scope.usersByStore = _.map(store.staffs, (item) => {
                            if (!item.isAccountant)
                                return item;
                        });
                    }, (error) => {
                    })
                    .finally(() => {
                    });
            }
        };

        $scope.selectedUserEvent = function (item) {
            // $scope.storeSelected.userCode = item.username;
            // $scope.storeSelected.userName = item.fullName;

            $scope.storeDraff.userCode = item.username;
            $scope.storeDraff.userName = item.fullName;

        };

        $scope.saveStore = () => {
            if (!$scope.storeDraff.storeId) {
                toastr.error('Chưa chọn cửa hàng!');
                return;
            }

            let isChange = $scope.storeDraff.storeId !== $scope.storeSelected.storeId
                || $scope.storeDraff.userId !== $scope.storeSelected.userId;

            $scope.storeSelected = angular.copy($scope.storeDraff);

            // if ($scope.isAccountant && !$scope.storeSelected.userId) {
            //     toastr.error('Chưa chọn nhân viên!');
            //     return;
            // }

            // if ($scope.step === 2) {
            Auth.setSessionProperty_StoreId_UserId($scope.storeSelected.storeId, $scope.storeSelected.userId, $scope.storeSelected.userCode, $scope.storeSelected.userName, $scope.storeSelected.storeName);
            $('#storeModal').modal('hide');
            // return;
            // }

            // Nếu đổi cửa hàng, nhân viên thì notify lại all page
            if ($scope.allowClose && isChange) {
                setTimeout(function () {
                    $rootScope.$broadcast(RELOAD_PAGE.CHANGE_STORE_OR_STAFF);
                }, 300);
            }

            // if ($scope.isAccountant && $scope.step === 1) {
            //     $scope.titleModal = "Chọn nhân viên";
            //     // $('.carousel-inner').css("overflow", "hidden");
            //     // $("#modalSelected").carousel("next");
            //     $scope.step++;
            //
            //     // setTimeout(function () {
            //     //     $('.carousel-inner').css("overflow", "visible");
            //     // }, 1000);
            //
            // }
        };

        $scope.$on(CONTRACT_EVENT.BLOCKING_UI, function (event, data) {
            if (data.isShow) {
                blockUI.start();
            } else {
                $scope.$apply(function () {
                    blockUI.stop();
                });
            }

            // setTimeout(function () {
            //     $scope.$apply(function () {
            //         blockUI.stop();
            //     });
            // }, 4000);
        });

        // $scope.showBlockUI = (isShow) => {
        //     if (isShow) {
        //         blockUI.start();
        //     } else {
        //         blockUI.stop();
        //     }
        // };

        $scope.admin = {
            layout: 'wide',
            menu: 'vertical',
            fixedHeader: true,
            fixedSidebar: true
        };

        $scope.toggleDropdown = (event) => {
            event.preventDefault();
            event.stopPropagation();
            $(event.currentTarget).parent().siblings().removeClass('show');
            $(event.currentTarget).parent().toggleClass('show');
            $(event.currentTarget).siblings().toggleClass('show');
        };

        $scope.logout = function () {
            let lang = window.localStorage[LANG_KEY];
            $('#storeModal').modal('hide');
            $('.modal-backdrop').remove();
            $(document.body).removeClass("modal-open");

            Auth.logout();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, lang);
        };

        $('#storeModal').on('show.bs.modal', function (e) {
            $scope.storeDraff = angular.copy($scope.storeSelected);
            if ($scope.usersByStore.length === 0) {
                $scope.formStoreProcessing = true;
                StoreManager.one($scope.storeSelected.storeId).one('listUserByStore').get()
                    .then((store) => {
                        $scope.usersByStore = _.map(store.staffs, (item) => {
                            if (!item.isAccountant)
                                return item;
                        });
                    }, (error) => {
                    })
                    .finally(() => {
                        $scope.formStoreProcessing = false;
                    });

            }
        });

        $('#storeModal').on('hide.bs.modal', function (e) {
            if (!$scope.storeDraff.userId) {
                $scope.usersByStore = [];
            }
        });

        $scope.showModalStore = () => {
            $scope.allowClose = true;
            $('#storeModal').modal('show');
        };

        $timeout(function () {
            const scrollables = $('.scrollable');
            if (scrollables.length > 0) {
                scrollables.each((index, el) => {
                    new PerfectScrollbar(el);
                });
            }

            $('#search-box-header').click(function () {
                let $searchBox = $(this);
                let $searchInput = $('.search-input');
                let searchBoxHasClassActive = $searchBox.hasClass('active');
                let searchInputHasClassActive = $searchInput.hasClass('active');

                if (searchBoxHasClassActive && searchInputHasClassActive) {
                    $searchBox.removeClass('active');
                    $searchInput.removeClass('active');
                } else {
                    $searchBox.addClass('active');
                    $searchInput.addClass('active');
                }
            });


            // // Sidebar links
            // $('.sidebar .sidebar-menu li a').on('click', function () {
            //     const $this = $(this);
            //
            //     if ($this.parent().hasClass('open')) {
            //         $this
            //             .parent()
            //             .children('.dropdown-menu')
            //             .slideUp(200, () => {
            //                 $this.parent().removeClass('open');
            //             });
            //     } else {
            //         $this
            //             .parent()
            //             .parent()
            //             .children('li.open')
            //             .children('.dropdown-menu')
            //             .slideUp(200);
            //
            //         $this
            //             .parent()
            //             .parent()
            //             .children('li.open')
            //             .children('a')
            //             .removeClass('open');
            //
            //         $this
            //             .parent()
            //             .parent()
            //             .children('li.open')
            //             .removeClass('open');
            //
            //         $this
            //             .parent()
            //             .children('.dropdown-menu')
            //             .slideDown(200, () => {
            //                 $this.parent().addClass('open');
            //             });
            //     }
            // });

            // // ٍSidebar Toggle
            // $('.sidebar-toggle').on('click', e => {
            //     $('.app').toggleClass('is-collapsed');
            //     e.preventDefault();
            // });

            // /**
            //  * Wait untill sidebar fully toggled (animated in/out)
            //  * then trigger window resize event in order to recalculate
            //  * masonry layout widths and gutters.
            //  */
            // $('#sidebar-toggle').click(e => {
            //     e.preventDefault();
            //     setTimeout(() => {
            //         window.dispatchEvent(window.EVENT);
            //     }, 300);
            // });

            $('#sidebar-toggle').click(function () {
                let bodyHasClass = $('body').hasClass('is-collapsed');

                if (bodyHasClass) {
                    $("body").removeClass("is-collapsed");
                } else {
                    $("body").addClass("is-collapsed");
                }

                //Khi thu gọn/mở rộng thanh menu thì trigger sự kiện resize của window để database thực hiện render lại ui
                setTimeout(function () {
                    $(window).trigger('resize');
                    $scope.$broadcast(CONTRACT_EVENT.RESIZE_TABLE);
                }, 300);

            });

            // let carouselConfig = {
            //     controlsClass: 'owl-controls',
            //     navigation: false,
            //     // navContainerClass: 'owl-nav',
            //     // navClass: ['owl-prev', 'owl-next'],
            //     // navText: ['<span class="fa fa-chevron-left"></span>', '<span class="fa fa-chevron-right"></span>'],
            //     loop: false,
            //     interval: false,
            //     margin: 12,
            //     dots: false,
            //     items: 1,
            //     responsiveClass: true,
            //     // responsive: {
            //     //     0: {
            //     //         items: 1,
            //     //         nav: true
            //     //     },
            //     //     450: {
            //     //         items: 2,
            //     //         nav: true
            //     //     },
            //     //     600: {
            //     //         items: 3,
            //     //         nav: true
            //     //     },
            //     //     800: {
            //     //         items: 5,
            //     //         nav: true
            //     //     },
            //     //     1000: {
            //     //         items: 5,
            //     //         nav: true,
            //     //         loop: false
            //     //     }
            //     // }
            //
            // };
            //
            // $('#modalSelected').carousel(carouselConfig);

        }, 0);
    }
})();