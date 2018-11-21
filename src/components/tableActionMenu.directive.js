(function () {
    'use strict';
    angular
        .module('ati.admin')
        .directive('tableActionMenu', function () {
            return {
                restrict: "AE",
                // transclude: true,
                link: function postLink(scope, element, $timeout, attrs, ctrl) {
                    let menu = $(element).find('.dropdown-menu');
                    let x = window.scrollX;
                    let y = window.scrollY;

                    function preventScroll() {
                        window.scrollTo(x, y);
                    }

                    $(element).find('[dropdown]').click(function (event) {
                        $(element).find('[dropdown]').focus();
                        menu.toggleClass('show');
                        if (menu.hasClass('show')) {
                            x = window.scrollX;
                            y = window.scrollY;
                            menu.css('top', event.clientY + 32 - event.offsetY + 1);
                            menu.css('left', event.clientX - event.offsetX - 1 - 135);
                            $(window).scroll(preventScroll);
                        }
                        if (!menu.hasClass('show')) {
                            $(window).off("scroll", preventScroll);
                        }
                    });

                    $(element).find('.dropdown-menu').click(function (event) {
                        menu.toggleClass('show');
                        if (menu.hasClass('show')) {
                            x = window.scrollX;
                            y = window.scrollY;
                            menu.css('top', event.clientY + 32 - event.offsetY + 1);
                            menu.css('left', event.clientX - event.offsetX - 1 - 135);
                            $(window).scroll(preventScroll);
                        }
                        if (!menu.hasClass('show')) {
                            $(window).off("scroll", preventScroll);
                        }
                    })

                    function clickOutSide(event) {
                        if (menu.hasClass("show")) {
                            if ($(event.target).closest(element).length == 0) {
                                menu.removeClass('show');
                                $(window).off("scroll", preventScroll);
                            }
                        }
                    }

                    function resize() {
                        menu.removeClass('show');
                    }

                    $(window).click(clickOutSide);

                    $(window).resize(resize);

                    scope.$on('$destroy', function () {
                        $(window).off("click", clickOutSide);
                        $(window).off("resize", resize);
                        $(window).off("scroll", preventScroll);
                    });
                },
                controller: function ($scope, ) {

                }
            }
        });
})();