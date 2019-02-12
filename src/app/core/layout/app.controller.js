(function () {
    'use strict';

    angular.module('ati.core.layout')
        .controller('AppController', App);

    function App($rootScope, $scope, Auth, userSession, $timeout, AUTH_EVENTS, LANG_KEY, storeList, Restangular, CONTRACT_EVENT) {
        $scope.storeList = angular.copy(Restangular.stripRestangular(storeList));
        $scope.currentUser = userSession;
        $scope.isRoot = Auth.isRoot();
        $scope.isAccountant = Auth.isAccountant();

        $scope.storeSelected = {storeId: ""};
        $scope.storeSelected.storeId = $scope.currentUser.selectedStoreId;
        if (!$scope.storeSelected.storeId) {
            $('#storeModal').modal({show: true, backdrop: 'static', keyboard: false});
        }

        $scope.saveStore = () => {
            if (!$scope.storeSelected.storeId) {
                toastr.error('Chưa chọn cửa hàng!');
                return;
            }

            Auth.setSessionPropertyStoreId($scope.storeSelected.storeId);
            $('#storeModal').modal('hide');
        };

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

            Auth.logout();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, lang);
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

            // Sidebar links
            $('.sidebar .sidebar-menu li a').on('click', function () {
                const $this = $(this);

                if ($this.parent().hasClass('open')) {
                    $this
                        .parent()
                        .children('.dropdown-menu')
                        .slideUp(200, () => {
                            $this.parent().removeClass('open');
                        });
                } else {
                    $this
                        .parent()
                        .parent()
                        .children('li.open')
                        .children('.dropdown-menu')
                        .slideUp(200);

                    $this
                        .parent()
                        .parent()
                        .children('li.open')
                        .children('a')
                        .removeClass('open');

                    $this
                        .parent()
                        .parent()
                        .children('li.open')
                        .removeClass('open');

                    $this
                        .parent()
                        .children('.dropdown-menu')
                        .slideDown(200, () => {
                            $this.parent().addClass('open');
                        });
                }
            });

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

        }, 0);
    }
})();