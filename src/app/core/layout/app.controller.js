(function () {
    'use strict';

    angular.module('ati.core.layout')
        .controller('AppController', App);

    function App($rootScope, $scope, Auth, userSession, $timeout, AUTH_EVENTS, LANG_KEY) {
        $scope.currentUser = userSession;

        $scope.isRoot = Auth.isRoot;
        $scope.isAdmin = Auth.isAdmin;
        $scope.isDoctor = Auth.isDoctor;

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
                }, 300);

            });

            // $('.sidebar-menu').delegate('.dropdown-toggle', 'click', function (e) {
            //     $(this).closest(".nav-item.dropdown").toggleClass("show");

            //     // setTimeout(() => {

            //     // }, 200);
            // });


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



            //Cấu hình dropdown cho sidebar
            $('.sidebar-menu .dropdown').on({
                "shown.bs.dropdown": function () {
                    this.closable = true;
                },
                "click": function () {
                    this.closable = true;
                },
                "hide.bs.dropdown": function () {
                    return this.closable;
                }
            });

            // $(window).on('maximize', function () {
            //     setTimeout(function () {
            //         $(window).trigger("resize");
            //     }, 200);

            // });

            // $(window).on('minimize', function () {
            //     setTimeout(function () {
            //         $(window).trigger("resize");
            //     }, 200);
            // })

            //
            // $('a.header-toggle').on('click', function(event) {
            //     event.preventDefault();
            //     event.stopPropagation();
            //     $(this).parent().siblings().toggleClass('show');
            //     $(this).parent().toggleClass('show');
            // });
        }, 0);
    }
})();