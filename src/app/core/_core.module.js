(function () {
    'use strict';

    var core = angular.module('ati.core', [
        'ui.router',

        // angular modules

        'ngAnimate',
        'ngSanitize',
        'pascalprecht.translate',
        // cached templates

        'templates-app',
        'templates-common',

        // dtag modules

        'ati.blocks.alerts',
        'ati.blocks.serverError',
        'ati.blocks.errorPage',
        'ati.blocks.misc',
        'ati.blocks.util',
        'ati.blocks.searchBox',
        'ati.blocks.atSortableQuery',
        'ati.blocks.confirmClick',
        'ati.blocks.event',

        'ati.core.bootstrap',
        'ati.core.auth',
        'ati.core.router',
        'ati.core.layout',
        'ati.core.widgets',
        'ati.core.login',
        'ati.core.data',
        'ati.core.historyStorage',
        'ati.core.language',

        // 3rd party modules
        'httpi',
        'underscore',
        'restangular',
        'angular-loading-bar',
        'ui.bootstrap',
        'ui.select',
        'daterangepicker',
        'base64'

    ]);

    core.directive('currencyInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/,/g, '')
                    $element.val($filter('number')(value, false))
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/,/g, '');
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, false))
                };

                $element.bind('change', listener)
                $element.bind('keydown', function (event) {
                    var key = event.keyCode
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
                        return
                    $browser.defer(listener) // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    $browser.defer(listener)
                })
            }
        }
    });

    core.directive('ngModelOnblur', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attr, ngModelCtrl) {
                if (attr.type === 'radio' || attr.type === 'checkbox') return;

                // elm.unbind('input').unbind('keydown').unbind('change');
                elm.bind('blur', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                });
            }
        };
    });

    core.run(appRun);

    function appRun(Auth, EXISTING_SESSION, $rootScope) {
        // EXISTING_SESSION set by deferred angular bootstrap
        if (EXISTING_SESSION) {
            Auth.initSession(EXISTING_SESSION);
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                // do something

                setTimeout(() => {
                    var activeElement = $("ul.sidebar-menu li.active").first();
                    if (activeElement) {
                        var dropElement = activeElement.closest("li.nav-item.dropdown");

                        $("ul.sidebar-menu li.dropdown").each(function (i, e) {
                            if ($(e).is(dropElement)) {
                                //nếu menu được chọn đang thuộc menu cha active thì ko làm gì cả
                            } else {
                                $(e).removeClass("show", {
                                    duration: 500
                                });
                            }
                        })
                        $("ul.dropdown-menu").removeClass("show", {
                            duration: 500
                        });

                        if (!activeElement.closest("li.nav-item.dropdown").hasClass("show")) {
                            activeElement.closest("li.nav-item.dropdown").addClass("show", {
                                duration: 500
                            });
                        }

                    }
                }, 100);
            });
    }
})();